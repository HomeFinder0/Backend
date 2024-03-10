const appError = require("../../../Helpers/appError.js");
const asyncHandler = require("express-async-handler");
const User = require("../models/User.js");
module.exports = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new appError("Invalid token or not verified", 404));
  
  if (!user.isVerified) return next(new appError("Please verify your email", 401));

  next();
});
