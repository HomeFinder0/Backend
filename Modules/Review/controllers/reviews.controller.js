const asyncHandler = require("express-async-handler");
const appError = require("../../../Helpers/appError.js");

const Residence = require('../../residence/models/Residence.js');
const Review = require('../models/Review.js');
const User = require('../../user/models/User.js');

exports.addReview = asyncHandler(async (req, res, next) => {
    let userId = req.user._id;
    const {residenceId} = req.params;
    const { rating } = req.body;
    if(rating < 1 || rating > 5) return next(new appError('Rating must be between 1 and 5', 400));

    let residence = await Residence.findById(residenceId);
    if(!residence) return next(new appError('Residence not found!', 404));

   if(String(residence.ownerId)==String(userId)) return next(new appError('You cannot review your own residence', 400));

    const review = await Review.create({residenceId:residenceId, userId, rating});
    if(req.body.comment) review.comment = req.body.comment;
  
    residence.reviews.push(review._id);
    review.populate([{
        path: 'userId',
        select: 'username image'
    }]);
    
    await review.save();
    await residence.save();
    
    return res.status(200).json({
      status: 'success',
      review
    });
  });
  

exports.getResidenceReviews = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const residence = await Residence.findById(residenceId).populate({
        path : 'reviews',
        populate :[ {
            path : 'userId',
            select : 'username image'
        },
        {
            path : 'likedUsers',
            select : 'username image'
        },{
            path : 'residenceId',
            select : 'title images location.fullAddress',
     
        }
    ]
    });

    if(!residence) return next(new appError('Residence not found', 404));

    res.status(200).json({
        status: 'success',
        reviews: residence.reviews
    });

});

exports.likeReview = asyncHandler(async (req, res, next) => {
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId).populate({
            path : 'userId',
            select : 'name image'
        })
    if(!review) return next(new appError('Review not found', 404));
    if(String(req.user._id) == String(review.userId._id)) return next(new appError('You cannot like your own review', 400))

    if(review.likedUsers.includes(req.user._id)) return next(new appError('You already liked this review', 400));

    review.likedUsers.push(req.user._id);
    review.likes += 1;
    await review.save();

    res.status(200).json({
        status: 'success',
        review
    });
})

exports.unLikeReview = asyncHandler(async (req, res, next) => {
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId).populate({
            path : 'userId',
            select : 'name image'
        });

    if(!review) return next(new appError('Review not found', 404));
    
    if(!review.likedUsers.includes(req.user._id)) return next(new appError('You have not liked this review', 400));
    if(review.likes == 0) return next(new appError('Review has no likes', 400));

    review.likedUsers.pull(req.user._id);
    review.likes -= 1;
    await review.save();

    res.status(200).json({
        status: 'success',
        review
    });
})