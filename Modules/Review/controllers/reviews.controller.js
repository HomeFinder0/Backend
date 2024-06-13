const asyncHandler = require("express-async-handler");
const appError = require("../../../Helpers/appError.js");

const Residence = require('../../residence/models/Residence.js');
const Review = require('../models/Review.js');

exports.addReview = asyncHandler(async (req, res, next) => {
    let userId = req.user._id;
    const {residenceId} = req.params;
    const { rating } = req.body;
    if(rating < 1 || rating > 5) return next(new appError('Rating must be between 1 and 5', 400));

    let residence = await Residence.findById(residenceId);
    if(!residence) return next(new appError('Residence not found!', 404));
    
    //Calculate average rating
    const reviews = await Review.find({ residenceId: residenceId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    residence.avgRating = Math.floor(totalRating / reviews.length);
    await residence.save();

    if(String(residence.ownerId)==String(userId)) return next(new appError('You cannot review your own residence', 400));

    let review = await Review.create({residenceId:residenceId, userId, rating});
    if(req.body.comment) review.comment = req.body.comment;
    
    residence.reviews.push(review._id);
    review = await review.populate([{
        path: 'userId',
        select: 'username image'
    }, {
        path: 'residenceId',
        select: 'title type salePrice category avgRating paymentPeriod images location.fullAddress'
    }])
    
    await review.save();
    await residence.save();
    
    return res.status(200).json({
        status: 'success',
        message: 'Review added successfully',
        review
    });
  });
  

exports.getResidenceReviews = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    let residence = await Residence.findById(residenceId).populate({
        path : 'reviews',
        populate :[ {
            path : 'userId',
            select : 'username image'
        },
        {
            path : 'likedBy',
            select : 'username image'
        },{
            path : 'residenceId',
            select : 'title images location.fullAddress',
     
        }
    ]
    });
    residence = residence.toJSON({userId : req.user._id});
    if(!residence) return next(new appError('Residence not found', 404));

    res.status(200).json({
        status: 'success',
        count: residence.reviews.length,
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

    if(review.likedBy.includes(req.user._id)) return next(new appError('You already liked this review', 400));

    review.likedBy.push(req.user._id);
    review.reviewLikes += 1;
    await review.save();

    res.status(200).json({
        status: 'success',
        message: 'Review liked successfully',
        reviewId: review._id,
        likes : review.reviewLikes
    });
})

exports.unLikeReview = asyncHandler(async (req, res, next) => {
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId).populate({
            path : 'userId',
            select : 'name image'
        });

    if(!review) return next(new appError('Review not found', 404));
    
    if(!review.likedBy.includes(req.user._id)) return next(new appError('You have not liked this review', 400));
    if(review.reviewLikes == 0) return next(new appError('Review has no likes', 400));

    review.likedBy.pull(req.user._id);
    review.reviewLikes -= 1;
    await review.save();

    res.status(200).json({
        status: 'success',
        message: 'Review unliked successfully',
        reviewId: review._id,
        likes : review.reviewLikes
    });
})