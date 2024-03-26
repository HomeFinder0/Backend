const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.methods.toJSON = function () {
  const conversation = this.toObject();
  delete conversation.__v;
  return conversation;
};
module.exports = mongoose.model("Conversation", conversationSchema);