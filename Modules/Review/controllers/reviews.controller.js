const asyncHandler = require("express-async-handler");
const appError = require("../../../Helpers/appError.js");

const Residence = require('../../residence/models/Residence.js');
const Review = require('../models/Review.js');
const User = require('../../user/models/User.js');

exports.addReview = asyncHandler(async (req, res, next) => {
    let userId = req.user._id;
    const {residenceId} = req.params;
    const { rating } = req.body;
  
    let residence = await Residence.findById(residenceId);
    if(!residence) return next(new appError('Residence not found!', 404));
  
    const review = await Review.create({residenceId:residenceId, userId, rating});
    if(req.body.comment) review.comment = req.body.comment;
  
    residence.reviews.push(review._id);
    review.populate('userId','username image');
    
    await review.save();
    await residence.save();
    
    review.populate('residenceId','userId');
    return res.status(200).json({
      status: 'success',
      review
    });
  });
  

exports.getResidenceReviews = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const residence = await Residence.findById(residenceId).populate({
        path : 'reviews',
        populate : {
            path : 'userId',
            select : 'name image'
        }
    });

    if(!residence) return next(new appError('Residence not found', 404));

    res.status(200).json({
        status: 'success',
        reviews: residence.reviews
    });

});

exports.like = asyncHandler(async (req, res, next) => {
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId).populate({
            path : 'userId',
            select : 'name image'
        })
    if(!review) return next(new appError('Review not found', 404));
    if(req.user._id == review.userId) return next(new appError('You cannot like your own review', 400))

    if(review.userLiked.includes(req.user._id)) return next(new appError('You already liked this review', 400));

    review.userLiked.push(req.user._id);
    review.likes += 1;
    await review.save();

    res.status(200).json({
        status: 'success',
        review
    });
})

exports.unLike = asyncHandler(async (req, res, next) => {
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId).populate({
            path : 'userId',
            select : 'name image'
        });

    if(!review) return next(new appError('Review not found', 404));
    
    if(!review.userLiked.includes(req.user._id)) return next(new appError('You have not liked this review', 400));
    if(review.likes == 0) return next(new appError('Review has no likes', 400));

    review.userLiked.pull(req.user._id);
    review.likes -= 1;
    await review.save();

    res.status(200).json({
        status: 'success',
        review
    });
})