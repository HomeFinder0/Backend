const asyncHandler = require("express-async-handler");
const Conversation = require("../models/Conversation.js");
const Message = require("../models/Message.js");
const User = require("../../user/models/User.js");
const appError = require("../../../Helpers/appError.js");

module.exports.createMessageManager = asyncHandler(
  async (messageContent, senderId, receiverId, next) => {
    if (!messageContent || !receiverId || !senderId) {
      return next(
        new appError("Please provide receiverId, sender and text", 400)
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

    let message = await Message.create({
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

    return message;
  }
);

module.exports.getConversationManager = asyncHandler(
  async (senderId, receiverId, next) => {
    if (!receiverId || !senderId)
      return next(new appError("Please provide senderId and receiverId.", 400));

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) conversation = [];

    return conversation;
  }
);

module.exports.searchChatUsersManager = asyncHandler(
  async (search, userId, next) => {
    let users = await User.find({
      $and: [
        { _id: { $ne: userId } },
        {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { fullName: { $regex: search, $options: "i" } },
          ],
        },
      ],
    });
    if (!users) users = [];
    return users;
  }
);

module.exports.getChatUsersManager = asyncHandler(async (userId, next) => {
  // Get sorted conversations based on the last message
  let lastMessages = await Conversation.find({ participants: userId })
    .select("lastMessage")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

  if (!lastMessages) return [];

  // Get user details of the receiver of the last message and add it to the lastMessage object
  let chatUsers = await Promise.all(
    lastMessages.map(async (conversation) => {
      let receiverId = conversation.lastMessage.receiverId;
      if (userId.toString() === conversation.lastMessage.receiverId.toString())
        receiverId = conversation.lastMessage.senderId;

      const user = await User.findById(receiverId).select(
        "username fullName image"
      );

      return { ...user.toObject(), lastMessage: conversation.lastMessage };
    })
  );

  if (!chatUsers) chatUsers = [];
  return chatUsers;
});

module.exports.editMessageManager = asyncHandler(
  async (userId, messageId, messageContent, next) => {
    if (!messageId || !messageContent) {
      return next(
        new appError("Please provide messageId and messageContent", 400)
      );
    }

    const message = await Message.findById(messageId);

    if (message.senderId.toString() !== userId.toString())
      return next(
        new appError("You are not authorized to edit this message", 401)
      );

    message.message.text = messageContent;
    await message.save();

    if (!message) return next(new appError("Message not found", 404));

    return message;
  }
);

module.exports.deleteMessageManager = asyncHandler(
  async (userId, messageId, next) => {
    if (!messageId) return next(new appError("Please provide messageId", 400));

    const conversation = await Conversation.findOne({
      messages: { $in: [messageId] },
    });
    if (!conversation) return next(new appError("Conversation not found", 404));

    const message = await Message.findById(messageId);
    if (!message) return next(new appError("Message not found", 404));

    if (message.senderId.toString() !== userId.toString())
      return next(
        new appError("You are not authorized to delete this message", 401)
      );

    conversation.messages = conversation.messages.filter(
      (message) => message.toString() !== messageId
    );

    await message.deleteOne();
    if (conversation.messages.length === 0 || !conversation.messages) {
      await conversation.deleteOne();
      return { conversation, message };
    }
    conversation.lastMessage = conversation.messages.at(-1);
    await conversation.save();
    return { conversation, message };
  }
);

module.exports.deleteConversationManager = asyncHandler(
  async (userId, receiverId, next) => {
    if (!receiverId || !userId)
      return next(new appError("Please provide ids", 400));

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
    });
    console.log(conversation);
    if (!conversation) return next(new appError("Conversation not found", 404));

    await Message.deleteMany({ _id: { $in: conversation.messages } });
    await conversation.deleteOne();

    if (conversation) return conversation;
  }
);
