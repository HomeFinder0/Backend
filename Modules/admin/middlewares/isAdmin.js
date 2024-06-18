const jwt = require("jsonwebtoken");
const appError = require("../../../Helpers/appError.js");
const User = require("../../user/models/User.js");
const asyncHandler = require("express-async-handler");

module.exports = asyncHandler(async (req, res, next) => {
    let {_id} = req.user;

    const user = await User.findById(_id);
    if (!user) return next(new appError("Invalid token or not verified", 404));
    
    if (user.role !== "admin") return next(new appError("Unauthorized!", 401));
    next();
});
