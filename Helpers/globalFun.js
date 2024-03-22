const asyncHandler = require("express-async-handler");
const appError = require("./appError");
const cloudinary = require("../config/cloudinary");
require("dotenv").config();
let data;

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    data = await Model.find({});
    res.json({
      status: "success",
      data,
    });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    data = await Model.findById(req.body.id);

    if (!data) return next(new appError("Not found!", 404));

    res.json({
      status: "success",
      data,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    data = await Model.create(req.body);

    res.json({
      status: "success",
      data,
    });
  });

exports.update = (Model) =>
  asyncHandler(async (req, res, next) => {
    data = await Model.findByIdAndUpdate(req.body.id, req.body);

    if (!data) return next(new appError("Not found!", 404));

    res.json({
      status: "success",
      data,
    });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    data = await Model.findByIdAndRemove(req.body.id, req.body);

    res.json({
      status: "success",
      data,
    });
  });

exports.deleteAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    data = await Model.deleteMany(req.body);

    res.json({
      status: "success",
      data,
    });
  });
