const User = require("../../user/models/User.js");
const asyncHandler = require("express-async-handler");
const appError = require("../../../Helpers/appError.js");
const { otpSending, resetPassEmail } = require("../managers/sendMail.js");

const {
  signupValidation,
  completeSignupValidation,
  loginValidation,
} = require("../validators/auth.validation.js");

const {
  resetPasswordValidation,
} = require("../../common/validation/common.validation.js");

exports.signUp = asyncHandler(async (req, res, next) => {
  let { value, error } = signupValidation(req.body);
  if (error) return next(new appError(error, 400));
  let user = await User.findOne({ username: value.username });
  if (user) error = "Username already exists.";

  if (!error) {
    user = await User.findOne({ email: value.email });
    if (user) error = "Email already exists.";
  }
  if (error) return next(new appError(error, 400));

  user = new User(value);
  await user.save();
  
  otpSending(user, res, next);

  const token = await user.generateAuthToken();
  return res.status(200).json({
    status: "success",
    message: "Verification code has been sent",
    token
  });
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user._id);
  if (user.isVerified)
    return next(new appError("You have already verified your email", 400));

  let otp = Number(req.body.otp);
  if (otp !== user.otp)
    return next(new appError("Invalid verification code", 400));

  user.isVerified = true;
  user.otp = null;
  user.counter = 0;
  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Email has been verified.",
  });
});

exports.resendCode = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user._id);

  if (user.isVerified)
    return next(new appError("You have already verified your email", 400));

  user.counter++;

  if (user.counter > 5) {
    setTimeout(() => {
      user.counter = 0;
      user.save();
    }, 10 * 60 * 1000);
    return next(
      new appError(
        "You have exceeded the maximum number of attempts, try again later",
        400
      )
    );
  }
  await otpSending(user, res, next);

  return res.status(200).json({
    status: "success",
    message: "Verification code has been sent",
  });
});

exports.completeSignup = asyncHandler(async (req, res, next) => {
  const { value, error } = completeSignupValidation(req.body);
  let user = await User.findById(req.user._id);

  if (error) return next(new appError(error, 400));

  user.firstName = value.firstName;
  user.lastName = value.lastName;
  user.fullName = `${value.firstName} ${value.lastName}`;
  user.phone = value.phone;
  user.gender = value.gender;

  await user.save();
  return res.status(200).json({
    status: "success",
    message: "Profile creation has been completed successfully",
  });
});

exports.logIn = asyncHandler(async (req, res, next) => {
  let { value, error } = loginValidation(req.body);
  if (error) return next(new appError(error, 400));

  const input = value.email;
  let user = await User.findOne({
    $or: [{ username: input }, { email: input }],
  });

  if (!user)
    return next(new appError("Invalid email, username, or password", 400));

  let isPassMatch = await user.passwordMatch(value.password);
  if (!isPassMatch || error)
    return next(new appError("Invalid email, username, or password", 400));

  let token = await user.generateAuthToken();
  res.json({
    status: "success",
    message: "Logged in successfully",
    isVerified : user.isVerified,
    token,
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  let email = req.body.email || req.params.email;
  if (email) email = email.toLowerCase().trim();

  let user = await User.findOne({ email });

  if (!user) return next(new appError("Invalid Email", 404));

  user.counter++;

  if (user.counter > 5) {
    setTimeout(() => {
      user.counter = 0;
      user.save();
    }, 10 * 60 * 1000);
    return next(
      new appError(
        "You have exceeded the maximum number of attempts, try again later",
        400
      )
    );
  }

  await resetPassEmail(user, res, next);

  return res.status(200).json({
    status: "success",
    message: "Verification code has been sent",
  });
});

exports.verifyPasswordOtp = asyncHandler(async (req, res, next) => {
  const email = req.params.email.toLowerCase().trim();
  let user = await User.findOne({ email });

  if (!user) return next(new appError("User not found", 404));

  let otp = Number(req.body.otp);

  if (user.passwordOtp.otp !== otp)
    return next(new appError("Otp is not correct.", 400));

  user.passwordOtp.isVerified = true;
  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Verification succeed.",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const email = req.params.email.toLowerCase().trim();
  let user = await User.findOne({ email });

  if (!user) return next(new appError("User not found", 404));

  if (!user.passwordOtp.isVerified)
    return next(new appError("Please verify reset Password.", 400));

  const { value, error } = resetPasswordValidation(req.body);
  const password = value.password;

  if (error) return next(new appError(error, 400));

  const isPassMatch = await user.passwordMatch(password);
  if (isPassMatch)
    return next(
      new appError("New password can't be the same as old password", 400)
    );

  user.password = password;
  user.passwordOtp.isVerified = false;
  user.passwordOtp.otp = null;
  user.counter = 0;

  await user.save();
  return res.status(200).json({
    status: "success",
    message: "Password has been reset",
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.tokens = user.tokens.filter((token) => token.token !== req.token);
  await user.save();
  return res.status(200).json({
    status: "success",
  });
});

exports.logoutAll = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.tokens = [];
  await user.save();
  return res.status(200).json({
    status: "success",
  });
});
