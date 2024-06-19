const asyncHandler = require("express-async-handler");
const appError = require("../../../Helpers/appError.js");
const axios = require("axios");

const Residence = require('../models/Residence.js');
const Review = require('../../Review/models/Review.js');
const User = require('../../user/models/User.js');

const {
    uploadImageWithoutFolder,
    deleteImage,
    deleteMultipleImages
} = require("../../../Helpers/cloud.js");

const getLocation = require("../../../Managers/getLocation.manager.js");

const {
    residenceValidation,
    stepOneCompleteValidation,
    stepTwoCompleteValidation,
    stepThreeCompleteValidation,
    stepFourCompleteValidation
} = require("../validators/residence.validation.js");


const { updateValidation } = require('../validators/update.validation.js');
const valueConversion = require('../middlewares/valueConversion.js')


//Creation functions
exports.createResidence = asyncHandler(async (req, res, next) => {
    const user = req.user;
    const { value, error } = residenceValidation(req.body);
    if (error) return next(new appError(error, 400));

    let Id = Math.floor(100000 + Math.random() * 900000);
    let residence = await Residence.findOne({ Id });

    while (residence) {
        Id = Math.floor(100000 + Math.random() * 900000);
        residence = await Residence.findOne({ Id });
    }

    residence = await Residence.create({ ...value, ownerId: user._id, Id });
    if (!residence) next(new appError("Unable to create residence", 500));

    residence = {
        _id: residence._id,
        title: residence.title,
        type: residence.type,
        category: residence.category,
        ownerId: residence.ownerId
    };

    res.status(201).json({
        status: "success",
        residence
    });
});
exports.stepOneUpdate = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    let value, error;

    if (req.route.path == "/complete/1st/:residenceId") {
        ({ value, error } = stepOneCompleteValidation(req.body));
    } else {
        ({ value, error } = updateValidation(req.body));
    }

    if (error) return next(new appError(error, 400));

    
    let residence = await Residence.findByIdAndUpdate(residenceId, value, { new: true });
    if (!residence) next(new appError("Residence not found!", 404));
    
    // await residence.save();
    valueConversion(value);

    // residence = {
    //     _id: residence._id,
    //     neighborhood: residence.neighborhood,
    //     mszoning: residence.mszoning,
    //     saleCondition: residence.saleCondition,
    //     moSold: residence.moSold,
    //     salePrice: residence.salePrice,
    //     paymentPeriod: residence.paymentPeriod,
    //     saleType: residence.saleType,
    //     utilities: residence.utilities,
    //     lotShape: residence.lotShape,
    //     electrical: residence.electrical,
    //     foundation: residence.foundation,
    //     bldgType: residence.bldgType,
    //     ownerId: residence.ownerId
    // }

    res.status(200).json({
        status: "success",
        residence
    });
});
exports.stepTwoUpdate = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    let value, error;

    if (req.route.path == "/complete/2nd/:residenceId") {
        ({ value, error } = stepTwoCompleteValidation(req.body));
    } else {
        ({ value, error } = updateValidation(req.body));
    }

    if (error) return next(new appError(error, 400));


    valueConversion(value);

    const residence = await Residence.findByIdAndUpdate(residenceId, value, { new: true });
    if (!residence) next(new appError("Residence not found!", 404));
    
    return res.status(200).json({
        status: "success",
        residence
    });
});
exports.stepThreeUpdate = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    let value, error;

    if (req.route.path == "/complete/3rd/:residenceId") {
        ({ value, error } = stepThreeCompleteValidation(req.body));
    } else {
        ({ value, error } = updateValidation(req.body));
    }

    if (error) return next(new appError(error, 400));

    valueConversion(value);

    const residence = await Residence.findByIdAndUpdate(residenceId, value, { new: true });
    if (!residence) next(new appError("Residence not found!", 404));
    residence.kitchenAbvGr = residence.KitchenAbvGr
    await residence.save();

    return res.status(200).json({
        status: "success",
        residence
    });
});
exports.stepFourUpdate = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    let value, error;

    if (req.route.path == "/complete/4th/:residenceId") {
        ({ value, error } = stepFourCompleteValidation(req.body));
    } else {
        ({ value, error } = updateValidation(req.body));
    }

    if (error) return next(new appError(error, 400));

    valueConversion(value);

    const residence = await Residence.findByIdAndUpdate(residenceId, value, { new: true }).populate({
        path: 'ownerId',
        select: 'username  location.fullAddress image'
    });

    if (!residence) next(new appError("Residence not found!", 404));

    residence.isCompleted = true;
    await residence.save();
    return res.status(200).json({
        status: 'success',
        residence
    });
});
exports.uploadResidenceImages = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    const residence = await Residence.findById(residenceId);
    if (!residence) next(new appError("Residence not found!", 404));
    if (!req.files) next(new appError("please, upload an image", 400));

    for (const file of req.files) {
        const image = await uploadImageWithoutFolder(file.path, next);
        residence.images.push(image);
    }

    await residence.save();
    res.status(200).json({
        status: "success",
        residenceId: residence._id,
        images: residence.images
    });
});
exports.setLocation = asyncHandler(async (req, res, next) => {
    const { longitude, latitude } = req.query;
    const { residenceId } = req.params;

    if (!longitude || !latitude) return next(new appError("Please provide a valid location", 400));

    const residence = await Residence.findById(residenceId);
    if (!residence) return next(new appError("Residence not found!", 404));

    let coord = [Number(longitude), Number(latitude)];
    residence.location = {
        type: 'Point',
        coordinates: coord
    };
    const location = await getLocation(latitude, longitude, next);
    if (!location) return next(new appError("Unable to get location", 500));

    if (location.country != 'United States' || location.city != 'Ames' || location.state != 'Iowa') return next(new appError("location must be inside Ames, Iowa, USA", 400))

    for (let key in location) {
        residence.location[key] = location[key];
    }

    await residence.save();

    return res.status(200).json({
        status: "success",
        residenceId: residence._id,
        location
    });
});

//Update functions
exports.updateResidence = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    const { value, error } = updateValidation(req.body);
    if (error) return next(new appError(error, 400));

    let residence = await Residence.findById(residenceId);
    if (!residence) next(new appError("Residence not found!", 404));

    if (req.user._id.toString() != residence.ownerId.toString()) return next(new appError("Unauthorized", 401));

    residence = await Residence.findByIdAndUpdate(residenceId, value, { new: true });

    return res.status(200).json({
        status: 'success',
        residence
    });
});

//Get functions
exports.getResidenceImages = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    const residence = await Residence.findById(residenceId).select('images');
    if (!residence) next(new appError("Residence not found!", 404));

    res.status(200).json({
        status: "success",
        residenceId: residence._id,
        images: residence.images
    });
});
exports.getLocation = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    const residence = await Residence.findById(residenceId).select('location');

    if (!residence) return next(new appError('residence not found!', 404));

    return res.status(200).json({
        status: 'success',
        residenceId: residence._id,
        location: residence.location
    })
});
exports.getAllApproved = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const page = req.query.page * 1 || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    let residences = await Residence.find({ isCompleted: true, status: 'approved' }).populate({
        path: 'ownerId',
        select: 'username image location.fullAddress'
    }).populate({
        path: 'reviews',
        populate: {
            path: 'userId likedBy',
            select: 'username image location.fullAddress',
        }
    }).skip(skip).limit(limit);

    residences = residences.map(res => {
        return res.toJSON({ userId: _id });
    });


    return res.status(200).json({
        status: 'success',
        count: residences.length,
        residences
    });
});
exports.getOneResidence = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    const { _id } = req.user;
    let residence = await Residence.findById(residenceId).populate([
        {
            path: 'ownerId',
            select: 'username  image location.fullAddress'
        },{
            path: 'buyerId',
            select: 'username  image location.fullAddress'
        }, {
            path: 'reviews',
            populate: [{
                path: 'userId',
                select: 'username image location.fullAddress'
            }, {
                path: 'likedBy',
                select: 'username image location.fullAddress'
            }]
        }
    ]);

    if (!residence) next(new appError("Residence not found!", 404));

    residence = residence.toJSON({ userId: _id });

    return res.status(200).json({
        status: 'success',
        residence
    });
});
exports.getNearestResidences = asyncHandler(async (req, res, next) => {
    const { longitude, latitude } = req.user.location;
    const { _id } = req.user;
    const page = req.query.page * 1 || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    if (!longitude || !latitude) return next(new appError("Please provide a valid location", 400));

    let residences = await Residence.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [Number(longitude), Number(latitude)]
                },
                $maxDistance: 3000 // 3km
            }
        }, isCompleted: true, status: 'approved', isSold: false
    }).populate([
        {
            path: 'ownerId',
            select: 'username image location.fullAddress'
        },
        {
            path: 'reviews',
            populate: {
                path: 'userId',
                select: 'username image location.fullAddress'
            }
        }
    ]).skip(skip).limit(limit);

    residences = residences.map(res => {
        return res.toJSON({ userId: _id });
    });


    return res.status(200).json({
        status: 'success',
        count: residences.length,
        residences
    });
});
exports.getPending = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const page = req.query.page * 1 || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    let residences = await Residence.find({ ownerId: _id, status: "pending", isCompleted: true }).populate([
        {
            path: 'ownerId',
            select: 'username  image location.fullAddress'
        },{
            path: 'buyerId',
            select: 'username  image location.fullAddress'
        }, {
            path: 'reviews',
            populate: {
                path: 'userId',
                select: 'username image location.fullAddress'
            }
        }
    ]).skip(skip).limit(limit);

    residences = residences.map(res => {
        return res.toJSON({ userId: _id });
    });


    return res.status(200).json({
        status: 'success',
        count: residences.length,
        residences
    });
});
exports.getApproved = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const page = req.query.page * 1 || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    let residences = await Residence.find({ ownerId: _id, status: "approved", isCompleted: true, isSold: false }).populate([
        {
            path: 'ownerId',
            select: 'username  image location.fullAddress'
        }, {
            path: 'buyerId',
            select: 'username  image location.fullAddress'
        },{
            path: 'reviews',
            populate: {
                path: 'userId',
                select: 'username image location.fullAddress'
            }
        }
    ]).skip(skip).limit(limit);

    residences = residences.map(res => {
        return res.toJSON({ userId: _id });
    });

    return res.status(200).json({
        status: 'success',
        count: residences.length,
        residences
    });
});
exports.getSold = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const page = req.query.page * 1 || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    let residences = await Residence.find({ ownerId: _id, isSold: true, isCompleted: true }).populate([
        {
            path: 'ownerId',
            select: 'username  image location.fullAddress'
        },{
            path: 'buyerId',
            select: 'username  image location.fullAddress'
        }, {
            path: 'reviews',
            populate: {
                path: 'userId',
                select: 'username image location.fullAddress'
            }
        }
    ]).skip(skip).limit(limit);

    residences = residences.map(res => {
        return res.toJSON({ userId: _id });
    });
    return res.status(200).json({
        status: 'success',
        count: residences.length,
        residences
    });
});

//search function
exports.filtration = asyncHandler(async (req, res, next) => {
    let { min, max, rating, bedroom, bathroom, neighborhood } = req.query;

    if (!min) min = 0;
    if (!max) max = 15000;
    if (!bedroom) bedroom = 1
    if (!bathroom) bathroom = 1

    if (bedroom == 7) bedroom = { $eq: bedroom }; else bedroom = { $gte: bedroom };
    let residences = await Residence.find({
        $and: [
            { salePrice: { $gte: min, $lte: max } },
            { bedroomAbvGr: bedroom },
            { totalbaths: { $gte: bathroom } },
        ]
    }).populate([
        {
            path: 'reviews',
            select: 'rating',
        }
    ]).select('title category avgRating salePrice location.fullAddress images neighborhood bedroomAbvGr totalbaths ');

    if (rating)
        residences = residences.filter(residence =>
            residence.reviews.some(review => review.rating >= rating)
        );

    if (neighborhood) residences = residences.filter(residence => residence.neighborhood === neighborhood);



    return res.status(200).json({
        status: 'success',
        count: residences.length,
        residences
    });
});

//Delete functions
exports.deleteOneResidence = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    const residence = await Residence.findById(residenceId);
    if (!residence) next(new appError("Residence not found!", 404));

    if (residence.images.length != 0) {
        let public_ids = residence.images.map((img) => img.public_id);
        await deleteMultipleImages(public_ids);
    }
    const user = await User.findOne({ wishlist: residenceId });

    if (user && user.wishlist) {
        user.wishlist = user.wishlist.filter((fav) => fav.toString() !== residenceId);
        await user.save();
    }

    const reviews = await Review.find({ residenceId });
    if (reviews) {
        for (const review of reviews) {
            await review.deleteOne();
        }
    }
    await residence.deleteOne();

    return res.status(200).json({
        status: 'success',
        message: "Residence deleted successfully"
    });
});
exports.deleteResidenceImage = asyncHandler(async (req, res, next) => {
    const { imageId } = req.params;
    const residence = await Residence.findOne({ images: { $elemMatch: { _id: imageId } } }).select('_id images');

    if (!residence) return next(new appError("Not found!", 404));

    let image = residence.images.filter((img) => img._id == imageId)
    await deleteImage(image[0].public_id);

    residence.images = residence.images.filter((img) => img._id != imageId);
    await residence.save();

    res.status(200).json({
        status: "success",
        message: "Image deleted successfully",
        residenceId: residence._id
    });
});


//ML functions
exports.predictPrice = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    let residence = await Residence.findById(residenceId);
    if (!residence) return next(new appError("Residence not found!", 400));

    residence = residence.mlFeatures();
    try {
        const response = await axios.post(`${process.env.FLASK_URL}/predict`, {
            residence
        });
        if (response.data.error) return next(new appError(response.data.error, 500))
        res.status(200).json({
            status: "success",
            predictedPrice: Math.floor(response.data),
            residence
        });

    } catch (error) {
        res.status(500).send(error.message);
    }

});
exports.recommend = asyncHandler(async (req, res, next) => {
    try {
        let residenceId = req.params.residenceId || req.body.residenceId;

        residenceId = parseInt(residenceId);
        if (!residenceId) return next(new appError("Please provide a residence id", 400));

        let residence = await Residence.findOne({ Id: residenceId });
        if (!residence) residence = await Residence.findOne();

        residenceId = parseInt(residence.Id);
        const response = await axios.post(`${process.env.FLASK_URL}/recommend`, {
            house_id: residenceId
        });

        let recommendedResidencesIds = response.data?.recommended_ids;

        let recommendedResidences = [];

        for (let i = 0; i < recommendedResidencesIds.length; i++) {
            let houseId = parseInt(recommendedResidencesIds[i]);
            let recommendedResidence = await Residence.findOne({ Id: houseId });
            if (recommendedResidence) {
                recommendedResidences.push(recommendedResidence);
            } else {
                // If a recommended residence is not found, you might want to handle it differently.
                // This line fetches a random residence, which might not be the desired behavior.
                recommendedResidences.push(await Residence.findOne());
            }
        }

        res.status(200).json({
            status: "success",
            data: recommendedResidences
        });
    } catch (error) {
        // Handle errors that occur during the recommendation process
        console.log(error);
        return next(new appError("An error occurred during the recommendation process", 500));
    }
});


//Admin functions
exports.totalSold = asyncHandler(async (req, res, next) => {
    let count = await Residence.countDocuments({ isSold: true });

    return res.status(200).json({
        status: 'success',
        totalSold: count
    });
});

exports.totalPending = asyncHandler(async (req, res, next) => {
    let count = await Residence.countDocuments({ status: "pending" });

    return res.status(200).json({
        status: 'success',
        totalPending: count
    });
});

exports.totalApproved = asyncHandler(async (req, res, next) => {
    let count = await Residence.countDocuments({ status: "approved" });

    return res.status(200).json({
        status: 'success',
        totalApproved: count
    });
});

exports.totalRejected = asyncHandler(async (req, res, next) => {
    let count = await Residence.countDocuments({ status: "rejected" });

    return res.status(200).json({
        status: 'success',
        totalRejected: count
    });
});

exports.getUncompleted = asyncHandler(async (req, res, next) => {
    let page = req.query.page * 1 || 1;
    let limit = 10;
    let skip = (page - 1) * limit;

    let residences = await Residence.find({ isCompleted: false }).select("title category salePrice avgRating ownerId ").populate({
        path: 'ownerId',
        select: 'username image'
    }).skip(skip).limit(limit);

    let total = await Residence.countDocuments({ isCompleted: false });
    residences = residences.map(res => {
        return res.toJSON({ userId: req.user._id });
    });

    return res.status(200).json({
        status: 'success',
        totalUncompleted: total,
        uncompletedCount: residences.length,
        residences
    });
});

exports.deleteUncompletedResidence = asyncHandler(async (req, res, next) => {
    let unUCompleted = await Residence.find({ isCompleted: false });
    let public_ids = unUCompleted.flatMap(residence => residence.images.map(img => img.public_id));
    if (public_ids.length > 0) {
        await deleteMultipleImages(public_ids);
    }
    await Residence.deleteMany({ isCompleted: false });

    return res.status(200).json({
        status: 'success',
        message: 'Uncompleted residences deleted successfully'
    });
});

exports.getSalePrice = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const residence = await Residence.findById(residenceId).select('_id salePrice');
    if(!residence) return next(new appError("Residence not found!", 404));

    return res.status(200).json({
        status: 'success',
        residenceId: residence._id,
        salePrice: residence.salePrice
    });
});

exports.updateSalePrice = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const {newPrice}   = req.body;
    if(!newPrice) return next(new appError("Please provide a sale price", 400));
    if(typeof newPrice !== 'number') return next(new appError("Sale price must be a number", 400));

    const residence = await Residence.findByIdAndUpdate(residenceId, {salePrice: newPrice}, {new:true}).select('_id salePrice');
    if(!residence) return next(new appError("Residence not found!", 404));

    return res.status(200).json({
        status: 'success',
        residenceId: residence._id,
        salePrice  : residence.salePrice
    });
});



exports.getPurchasedResidences = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const page = req.query.page * 1 || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    let residences = await Residence.find({ buyerId: _id, isSold: true }).populate([
        {
            path: 'ownerId',
            select: 'username  image location.fullAddress'
        },{
            path: 'buyerId',
            select: 'username  image location.fullAddress'
        }, {
            path: 'reviews',
            populate: {
                path: 'userId',
                select: 'username image location.fullAddress'
            }
        }
    ]).select("title category type isSold isCompleted avgRating location images reviews ownerId buyerId ").skip(skip).limit(limit);

    residences = residences.map(res => {
        return res.toJSON({ userId: _id });
    })

    return res.status(200).json({
        status: 'success',
        count: residences.length,
        residences
    });
});

exports.book = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    const residence = await Residence.findById(residenceId);
    if (!residence) return next(new appError("Residence not found!", 404));

    if (residence.ownerId && residence.ownerId.toString() === req.user._id.toString()) return next(new appError("You can't book your own residence", 400));
    if (residence.isSold) return next(new appError("Already sold ", 400));
    if (residence.bookedBy && residence.bookedBy.includes(req.user._id)) return next(new appError("Already booked", 400));
    
    residence.bookedBy = residence.bookedBy || [];
    console.log(residence.bookedBy);
    residence.bookedBy.push(req.user._id);

    await residence.save();

    return res.status(200).json({
        status: 'success',
        message: 'Residence booked successfully',
    });
});

exports.getBookedBy = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    const residence = await Residence.findById(residenceId).select('bookedBy');
    if (!residence) return next(new appError("Residence not found!", 404));

    await residence.populate({
        path: 'bookedBy',
        select : 'username image'
    });

    return res.status(200).json({
        status: 'success',
        residenceId: residence._id,
        bookedBy: residence.bookedBy
    });
});

exports.cancelBooking = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    const { userId } = req.params;

    const residence = await Residence.findById(residenceId).select('bookedBy');
    if (!residence) return next(new appError("Residence not found!", 404));

    if(residence.ownerId && residence.ownerId.toString() === req.user._id.toString() ) return next(new appError("Unauthorized!", 400));
    else if(!residence.ownerId && req.user.role != 'admin') return next(new appError("Unauthorized!", 400));

    
    if(!residence.bookedBy || residence.bookedBy.length == 0) return next(new appError("No booked", 400));
    if(!residence.bookedBy.includes(userId)) return next(new appError("User has not booked this residence", 400));
    
    residence.bookedBy = residence.bookedBy.filter(id => id.toString() !== userId.toString());
    await residence.save();

    return res.status(200).json({
        status: 'success',
        message: 'Booking canceled successfully'
    });
});

exports.acceptBooking  = asyncHandler(async (req, res, next) => {
    const { residenceId } = req.params;
    const { userId } = req.params;
    
    const residence = await Residence.findById(residenceId).select("bookedBy ownerId avgRating category title salePrice");
    if (!residence) return next(new appError("Residence not found!", 404));
    console.log(req.user.role)
    if(residence.ownerId && residence.ownerId.toString() === req.user._id.toString() ) return next(new appError("Unauthorized!", 400));
    else if(!residence.ownerId && req.user.role != 'admin') return next(new appError("Unauthorized!", 400));
    
    if(residence.buyerId && residence.buyerId.toString() === req.user._id.toString() ) return next(new appError("You have already purchased this residence", 400));
    if(residence.isSold) return next(new appError("Already sold!", 400));

    if(!residence.bookedBy || residence.bookedBy.length == 0) return next(new appError("No booked", 400));
    if(!residence.bookedBy.includes(userId)) return next(new appError("User has not booked this residence", 400));

    residence.bookedBy = [];
    residence.buyerId  = userId;
    residence.isSold   = true;
    await residence.save();
    
    await residence.populate([
        {
            path: 'ownerId',
            select: 'username  image'
        },{
            path: 'buyerId',
            select: 'username  image'
        }, {
            path: 'reviews',
            populate: {
                path: 'userId',
                select: 'username image'
            }
        }
    ]);

    return res.status(200).json({
        status: 'success',
        message: 'Residence Purchase successfully. Residence is now sold',
        residence
    });
});

exports.updateResidenceStatus = asyncHandler(async (req, res, next) => {
    const residenceId = req.params.residenceId || req.body.residenceId;
    const { status } = req.body;

    if (!status) return next(new appError("Please provide a status", 400));

    if (status !== 'approved' && status !== 'rejected')
        return next(new appError("Invalid status. Choices are 'approved' or 'rejected'.", 400));

    let residence = await Residence.findByIdAndUpdate(residenceId, { status }, { new: true });
    if (!residence) return next(new appError("Residence not found!", 404));

    return res.status(200).json({
        status: 'success',
        residence
    });
});

exports.getNewResidences = asyncHandler(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Query for residences created within the last 30 days
    let residences = await Residence.find({
        isCompleted: true,
        status: 'approved',
        createdAt: { $gte: thirtyDaysAgo } // Use $gte to find documents with createdAt greater than or equal to thirtyDaysAgo
    }).sort({ createdAt: -1 }).skip(skip).limit(limit);

    if (residences.length === 0) {
        residences = await Residence.find({
            isCompleted: true,
            status: 'approved',
        }).sort({ createdAt: -1 }).limit(limit);
    }
    // Return the residences
    return res.status(200).json({
        status: 'success',
        residences,
        residences_count: residences.length
    });
});