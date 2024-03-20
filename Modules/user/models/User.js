const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },

    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    phone: { type: String },
    gender: { type: String, enum: ["male", "Male", "Female", "female"] },
    role: { type: String, default: "user", enum: ["user", "admin"] },

    image: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dgslxtxg8/image/upload/v1703609152/iwonvcvpn6oidmyhezvh.jpg",
      },
      public_id: { type: String },
    },

    location: {
      longitude: {
        type: Number,
      },
      latitude: {
        type: Number,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      fullAddress: {
        type: String,
      },
    },
    wishlist: [{ type: mongoose.Schema.ObjectId, ref: "Products" }],
    tokens: [
      {
        token: {
          required: true,
          type: String,
        },
      },
    ],
    otp: { type: Number },
    passwordOtp: {
      otp: { type: Number, default: null },
      isVerified: { type: Boolean, default: false },
    },
    counter: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  user.tokens = user.tokens.concat({ token });
  return token;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.otp;
  delete userObject.counter;
  delete userObject.tokens;
  delete userObject.__v;
  delete userObject.wishlist;
  delete userObject.chatWith;
  delete userObject.passwordOtp;
  return userObject;
};

userSchema.methods.passwordMatch = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

module.exports = mongoose.model("Users", userSchema);
