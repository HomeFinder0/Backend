const asyncHandler = require("express-async-handler");
const { io, getReceiverSocketId } = require("../../../Socket/socket.js");
const {
  createMessageManager,
  getConversationManager,
  searchChatUsersManager,
  getChatUsersManager,
  editMessageManager,
  deleteMessageManager,
  deleteConversationManager,
} = require("../managers/chat.manager.js");
const appError = require("../../../Helpers/appError.js");
const { uploadCloudFolder,deleteCloudFolder } = require("../../../Helpers/cloud.js");

module.exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { messageContent } = req.body;
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;

  const message = await createMessageManager(
    messageContent,
    senderId,
    receiverId,
    next
  );
  if (!message) return next(new appError("Message not sent", 500));

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    // io.to<socketId> is used to send events to a specific client.
    io.to(receiverSocketId).emit("newMessage", {
      newMessage: message,
    });
    io.to(receiverSocketId).emit("newNotification", {
      message: "New message from " + req.user.username,
      senderId: req.user._id,
      isRead: false,
    });
  }

  res.status(201).json({ status: "success", message });
});

module.exports.getMessages = asyncHandler(async (req, res, next) => {
  const { receiverId } = req.params;
  const senderId = req.user._id;

  const messages = await getConversationManager(senderId, receiverId, next);

  res.status(200).json({
    status: "success",
    messages,
  });
});

module.exports.searchUsers = asyncHandler(async (req, res, next) => {
  const { search } = req.query;
  const userId = req.user._id;
  let users = await searchChatUsersManager(search, userId, next);

  res.status(200).json({ status: "success", users });
});

module.exports.getConversations = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  let chatUsers = await getChatUsersManager(userId, next);

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
  if (!message) return next(new appError("Message not found", 404));

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
  if (!message || !conversation)
    return next(new appError("Message not found", 404));

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

  let conversation = await deleteConversationManager(userId, receiverId, next);
  if (!conversation)
    return next(new appError("Conversation cannot delete.", 404));

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("conversationDeleted", {
      conversationId: conversation._id,
    });
  }
  res.status(201).json({ status: "success", message: "Conversation deleted" });
});

module.exports.sendMedia = asyncHandler(async (req, res, next) => {

  const images = await uploadCloudFolder(req.user._id, req.files);

  await deleteCloudFolder(req.user._id);
  
  res.status(201).json({ status: "success", images });
});
