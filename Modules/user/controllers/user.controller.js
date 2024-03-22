const getLocation = require("../managers/getLocation.manager.js");
const User = require("../models/User.js");
const asyncHandler = require("express-async-handler");
const appError = require("../../../Helpers/appError.js");
const { updateUserValidation } = require("../validators/user.validation.js");
const {
  resetPasswordValidation,
} = require("../../common/validation/common.validation.js");

const { uploadImage, deleteImage } = require("../../../Helpers/cloud.js");

exports.setLocation = asyncHandler(async (req, res, next) => {
  let { user } = req;

  const { longitude, latitude } = req.query;

  if (!longitude || !latitude)
    return next(new appError("Please provide a valid location", 400));

  user.location = {
    longitude: Number(longitude),
    latitude: Number(latitude),
  };
  const location = await getLocation(latitude, longitude, next);

  for (let key in location) {
    user.location[key] = location[key];
  }
  await user.save();

  return res.status(200).json({
    status: "success",
    location,
  });
});

exports.uploadAvatar = asyncHandler(async (req, res, next) => {
  let { user } = req;
  if (!req.file) return next(new appError("Please provide an image", 400));
  if (user.image.public_id !== process.env.DEFAULT_AVATAR_ID)
    await deleteImage(user.image.public_id);

  let image = await uploadImage("avatar", req.file.path);
  user.image = image;
  await user.save();

  return res.status(200).json({
    status: "success",
    image: user.image,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id || req.user._id;
  let user = await User.findById(userId);
  if (!user) return next(new appError("User not found", 404));

  return res.status(200).json({
    status: "success",
    user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { value, error } = updateUserValidation(req.body);
  if (error) return next(new appError(error, 400));

  let user = await User.findById(req.user._id);

  if (value.username) {
    let checkUser = await User.findOne({ username: value.username });
    if (checkUser && checkUser._id.toString() !== user._id.toString())
      return next(new appError("Username already exists", 400));
  }

  if (value.email || value.password)
    return next(
      new appError("You can't change your email or password from here", 400)
    );

  for (let key in value) {
    user[key] = value[key];
  }
  user.fullName = `${user.firstName} ${user.lastName}`;
  await user.save();

  return res.status(200).json({
    status: "success",
    user,
    message: "Profile has been updated",
  });
});

exports.deleteProfilePicture = asyncHandler(async (req, res, next) => {
  let { user } = req;

  if (user.image.public_id === process.env.DEFAULT_AVATAR_ID)
    return next(new appError("You don't have a profile picture", 400));

  await deleteImage(user.image.public_id);

  user.image.url = process.env.DEFAULT_AVATAR_URL;
  user.image.public_id = process.env.DEFAULT_AVATAR_ID;

  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Profile picture has been deleted",
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  let { user } = req;
  if (!user) return next(new appError("User not found", 404));

  const isPassMatch = await user.passwordMatch(req.body.password);
  if (!isPassMatch)
    return next(new appError("Invalid password, please try again", 400));

  if (user.image.public_id !== process.env.DEFAULT_AVATAR_ID)
    await deleteImage(user.image.public_id);

  await user.deleteOne();
  return res.status(200).json({
    status: "Deleted success",
  });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  let { user } = req;

  const isPassMatch = await user.passwordMatch(req.body.oldPassword);
  if (!isPassMatch)
    return next(
      new appError("Old password is Invalid , please try again", 400)
    );

  if (req.body.oldPassword === req.body.newPassword)
    return next(
      new appError("New password can't be the same as old password", 400)
    );

  req.body.password = req.body.newPassword;
  const { value, error } = resetPasswordValidation(req.body);
  if (error) return next(new appError(error, 400));

  const { password } = value;

  user.password = password;
  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Password has been changed",
  });
});
