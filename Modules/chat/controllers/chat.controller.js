const asyncHandler = require("express-async-handler");
const Conversation = require("../models/Conversation.js");
const Message = require("../models/Message.js");
const User = require("../../user/models/User.js");
const appError = require("../../../Helpers/appError.js");
const { io, getReceiverSocketId } = require("../../../Socket/socket.js");

module.exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { messageContent } = req.body;
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;

  if (!messageContent || !receiverId) {
    return next(
      new appError("Please provide conversationId, sender and text", 400)
    );
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const message = await Message.create({
    message: { text: messageContent },
    senderId,
    receiverId,
  });

  if (!message) return next(new appError("Message not sent", 500));

  const receiver = await User.findById(receiverId);
  if (!receiver) return next(new appError("User not found", 404));

  conversation.lastMessage = message._id;
  conversation.messages.push(message._id);
  await conversation.save();

  await receiver.save();

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    // io.to<socketId> is used to send events to a specific client.
    io.to(receiverSocketId).emit("newMessage", {
      newMessage: message,
    });
  }

  res.status(201).json({ status: "success", message });
});

module.exports.getMessages = asyncHandler(async (req, res, next) => {
  const receiverId = req.params.receiverId;
  const senderId = req.user._id;
  if (!receiverId) return next(new appError("Please provide receiverId", 400));

  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  }).populate("messages");

  res.status(200).json({
    status: "success",
    messages: conversation.messages ? conversation.messages : [],
  });
});

module.exports.searchUsers = asyncHandler(async (req, res, next) => {
  const { search } = req.query;
  if (!search) return next(new appError("Please provide search query", 400));

  const users = await User.find({
    $or: [
      { username: { $regex: search, $options: "i" } },
      { fullName: { $regex: search, $options: "i" } },
    ],
  });

  res.status(200).json({ status: "success", users });
});

module.exports.getConversations = asyncHandler(async (req, res, next) => {
  // Get sorted conversations based on the last message
  const lastMessages = await Conversation.find({ participants: req.user._id })
    .select("lastMessage")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

  if (!lastMessages) return next(new appError("Conversations not found", 404));

  // Get user details of the receiver of the last message and add it to the lastMessage object
  const chatUsers = await Promise.all(
    lastMessages.map(async (conversation) => {
      const receiverId = conversation.lastMessage.receiverId;

      const user = await User.findById(receiverId).select(
        "username fullName image"
      );

      return { ...user.toObject(), lastMessage: conversation.lastMessage };
    })
  );

  res.status(200).json({ status: "success", chatUsers });
});

module.exports.editMessage = asyncHandler(async (req, res, next) => {
  const messageId = req.params.messageId;
  const { messageContent } = req.body;
  if (!messageId || !messageContent) {
    return next(
      new appError("Please provide messageId and messageContent", 400)
    );
  }

  const message = await Message.findById(messageId);

  if (message.senderId.toString() !== req.user._id.toString())
    return next(
      new appError("You are not authorized to edit this message", 401)
    );

  message.message.text = messageContent;
  await message.save();

  if (!message) return next(new appError("Message not found", 404));

  const receiverSocketId = getReceiverSocketId(message.receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("messageEdited", { message });
  }

  res.status(201).json({ status: "success", updatedMessage: message });
});

module.exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const messageId = req.params.messageId;
  if (!messageId) return next(new appError("Please provide messageId", 400));

  const conversation = await Conversation.findOne({
    messages: { $in: [messageId] },
  });

  const message = await Message.findById(messageId);
  if (!message) return next(new appError("Message not found", 404));

  if (message.senderId.toString() !== req.user._id.toString())
    return next(
      new appError("You are not authorized to delete this message", 401)
    );

  if (!conversation) return next(new appError("Conversation not found", 404));
  conversation.messages = conversation.messages.filter(
    (message) => message.toString() !== messageId
  );

  await message.deleteOne();
  await conversation.save();

  const receiverSocketId = getReceiverSocketId(message.receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("messageDeleted", { message });
  }

  res.status(201).json({ status: "success", message: "Message deleted" });
});

module.exports.deleteConversation = asyncHandler(async (req, res, next) => {
  const receiverId = req.params.receiverId;
  if (!receiverId) return next(new appError("Please provide receiverId", 400));

  const conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, receiverId] },
  });
  if (!conversation) return next(new appError("Conversation not found", 404));

  await Message.deleteMany({ _id: { $in: conversation.messages } });
  await conversation.deleteOne();

  res.status(201).json({ status: "success", message: "Conversation deleted" });
});
