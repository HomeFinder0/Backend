const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      text: {
        type: String,
        required: true,
      },
      media: {
        type: [{ url: String, public_id: String }],
        required: false,
      },
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.methods.toJSON = function () {
  const message = this.toObject();
  delete message.__v;
  delete message.message.__v;
  if (message.message.media.length > 0) {
    const urls = message.message.media.map((item) => item.url);
    message.message.media = urls;
  }
  return message;
};
module.exports = mongoose.model("Message", messageSchema);
