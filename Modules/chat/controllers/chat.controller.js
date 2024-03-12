const asyncHandler = require("express-async-handler");
const Conversation = require("../models/Conversation.js");
const Message = require("../models/Message.js");
const User = require("../../user/models/User.js");
const appError = require("../../../Helpers/appError.js");
const { io, getReceiverSocketId } = require("../../../Socket/socket.js");
const {
  createMessage,
  getConversation,
  searchChatUsers,
  getChatUsers,
  editMessageManager,
  deleteMessageManager,
  deleteConversationManager,
} = require("../managers/chat.manager.js");

module.exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { messageContent } = req.body;
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;

  const message = await createMessage(
    messageContent,
    senderId,
    receiverId,
    next
  );

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

  const messages = await getConversation(senderId, receiverId, next);

  res.status(200).json({
    status: "success",
    messages,
  });
});

module.exports.searchUsers = asyncHandler(async (req, res, next) => {
  const { search } = req.query;
  const userId = req.user._id;
  let users = await searchChatUsers(search, userId, next);

  res.status(200).json({ status: "success", users });
});

module.exports.getConversations = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  let chatUsers = await getChatUsers(userId, next);

  res.status(200).json({ status: "success", chatUsers });
});

module.exports.editMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;
  const { messageContent } = req.body;
  const userId = req.user._id;
  const message = await editMessageManager(
    userId,
    messageId,
    messageContent,
    next
  );

  const receiverSocketId = getReceiverSocketId(message.receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("messageEdited", message);
  }

  res.status(201).json({ status: "success", updatedMessage: message });
});

module.exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { messageId } = req.params;

  const { message, conversation } = await deleteMessageManager(
    userId,
    messageId,
    next
  );
  const receiverSocketId = getReceiverSocketId(message.receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("messageDeleted", message);
    if (!conversation.messages) {
      io.to(receiverSocketId).emit("conversationDeleted", {
        conversationId: conversation._id,
      });
    }
  }

  res.status(201).json({ status: "success", message: "Message deleted" });
});

module.exports.deleteConversation = asyncHandler(async (req, res, next) => {
  const { receiverId } = req.params;
  const userId = req.user._id;

  const conversation = await deleteConversationManager(
    userId,
    receiverId,
    next
  );

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("conversationDeleted", {
      conversationId: conversation._id,
    });
  }

  res.status(201).json({ status: "success", message: "Conversation deleted" });
});