const router = require("express").Router();
const authMiddleware = require("../../authentication/middlewares/auth.middleware.js");
const {
  sendMessage,
  getConversations,
  getMessages,
  searchUsers,
  editMessage,
  deleteMessage,
  deleteConversation,
} = require("../controllers/chat.controller.js");
const { uploadMultiple } = require("../../../Utils/multer.js");
const isVerified = require("../../user/middlewares/user.isVerified.js");

router.use(authMiddleware);
router.use(isVerified);

router.post("/send/:receiverId", uploadMultiple, sendMessage);

router.get("/get-conversation/:receiverId", getMessages);

router.get("/get-conversations", getConversations);

router.get("/search-users", searchUsers);

router.patch("/edit-message/:messageId", editMessage);

router.delete("/delete-message/:messageId", deleteMessage);

router.delete("/delete-conversation/:receiverId", deleteConversation);

module.exports = router;
