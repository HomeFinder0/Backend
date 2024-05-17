const asyncHandler = require("express-async-handler");
const appError = require("../../../Helpers/appError.js");

const Residence = require('../models/Residence.js');
const Review = require('../../Review/models/Review.js');
const User = require('../../user/models/User.js');

const {
    uploadImage,
    deleteMultipleImages
} = require("../../../Helpers/cloud.js");
const getLocation = require("../../../Managers/getLocation.manager.js");
const { 
    residenceValidation,
    completeResidenceValidation,
    stepTwoCompleteValidation,
    stepThreeCompleteValidation,
    stepFourCompleteValidation
} = require("../validators/residence.validation.js");

const { updateResidenceValidation } = require("../validators/updateResidence.validation.js");
const valueConversion = require('../middlewares/valueConversion.js')
const { 
    neighborhoodConverter
    } = require("../../../Helpers/converter.js");


// @desc Create a residence
// @method Post
exports.createResidence = asyncHandler(async (req, res, next) => {
    const user = req.user;
    const {value, error} = residenceValidation(req.body);
    if(error) return next(new appError(error, 400));
    
    let residence = await Residence.create({...value, ownerId: user._id});
    if(!residence) next(new appError("Unable to create residence", 500));

    res.status(201).json({
        status: "success",
        residence
    });
});
exports.completeResidence = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;

    const {value, error} = completeResidenceValidation(req.body);
    if(error) return next(new appError(error, 400));
    
    switch(value.utilities.length) {
        case 3:
            value.utilities = 'AllPub';
            break;
        case 1:
            value.utilities = 'ELO';
            break;
        default:
            value.utilities = value.utilities.includes('gas') ? 'NoSeWa' : value.utilities.includes('water') ? 'NoSewr' : value.utilities;
            break;
    }
    
    valueConversion(value);
    
    const residence = await Residence.findByIdAndUpdate(residenceId, value, {new: true});
    if(!residence) next(new appError("Residence not found!", 404));

    await residence.save();
    
    res.status(200).json({
        status: "success",
        residence
    });
});
exports.stepTwoComplete = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const {value, error} = stepTwoCompleteValidation(req.body);
    if(error) return next(new appError(error, 400));
    valueConversion(value);
    const residence = await Residence.findByIdAndUpdate(residenceId, value, {new: true});
    if(!residence) next(new appError("Residence not found!", 404));

    return res.status(200).json({
        status:"success",
        residence
    });
});
exports.stepThreeComplete = asyncHandler( async(req, res, next) => {
    const {residenceId} = req.params;
    const {value, error} = stepThreeCompleteValidation(req.body);
    if(error) return next(new appError(error, 400));
    
    valueConversion(value);

    const residence = await Residence.findByIdAndUpdate(residenceId, value, {new: true});
    if(!residence) next(new appError("Residence not found!", 404));

    return res.status(200).json({
        status:"success",
        residence
    });
});
exports.stepFourComplete = asyncHandler( async(req, res, next) => {
    const {value, error} = stepFourCompleteValidation(req.body);
    if(error) return next(new appError(error, 400));
    
    const {residenceId} = req.params;

    valueConversion(value);

    const residence = await Residence.findByIdAndUpdate(residenceId, value, {new: true}).populate({
        path: 'ownerId',
        select: 'username  location.fullAddress image'});

    if(!residence) next(new appError("Residence not found!", 404));
    
    residence.isCompleted = true;
    await residence.save();
    return res.status(200).json({
        status: 'success',
        residence
    });
});
exports.residenceImages = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const residence = await Residence.findById(residenceId);
    if(!residence) next(new appError("Residence not found!", 404));
    if(! req.files) next(new appError("please, upload an image", 400));
    
    for (const file of req.files) {
        const image = await uploadImage(residenceId, file.path, next);
        residence.images.push(image);
    }

    await residence.save();
    res.status(200).json({
        status: "success",
        residenceId : residence._id,
        images: residence.images
    });
});
exports.deleteResidenceImage = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const residence = await Residence.findById(residenceId);
    if(!residence) next(new appError("Residence not found!", 404));
    
    const images = residence.images.find(img => img.url == imageId);
    if(!images) next(new appError("Image not found!", 404));
    let public_ids = images.map((img) => img.public_id);
    deleteMultipleImages(public_ids);
    residence.images = residence.images.filter(img => img.url !== imageId);
    await residence.save();
    
    res.status(200).json({
        status: "success",
        residenceId : residence._id,
        message: "Image deleted successfully"
    });
});
exports.setLocation = asyncHandler(async (req, res, next) => {
    const { longitude, latitude } = req.query;
    const { residenceId } = req.params;

    if (!longitude || !latitude)   return next(new appError("Please provide a valid location", 400));
    
    const residence = await Residence.findById(residenceId);
    if (!residence) return next(new appError("Residence not found!", 404));
    
    let coord = [Number(longitude), Number(latitude)];
    residence.location = {
        type     : 'Point',
        coordinates: coord
    };
    const location = await getLocation(latitude, longitude, next); 
    if (!location) return next(new appError("Unable to get location", 500));

    if(location.country != 'United States' || location.city != 'Ames' || location.state != 'Iowa') return next(new appError("location must be inside Ames, Iowa, USA", 400))
    
    for (let key in location) {
        residence.location[key] = location[key];
    }

    await residence.save();

    return res.status(200).json({
    status: "success",
    residenceId : residence._id,
    location
    });
});

// @desc Get a residence
// @method Get
exports.getAllResidences = asyncHandler(async (req, res, next) => {
    const page  = req.query.page  * 1 || 1;
    const limit = 10;
    const skip  = (page - 1) * limit;

    let residences = await Residence.find({ isCompleted: true, status: 'approved' }).populate({
        path: 'ownerId',
        select:'username image location.fullAddress'
    }).populate({
        path: 'reviews',
        populate: {
            path: 'userId likedUsers',
            select : 'username image location.fullAddress',
        }
    }).skip(skip).limit(limit);

    await deleteUncompletedResidence(Residence);
    
    return res.status(200).json({
        status: 'success',
        count : residences.length,
        residences
    });
});
exports.getOneResidence = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const residence = await Residence.findById(residenceId).populate([
    { 
        path: 'ownerId',
        select: 'username  image location.fullAddress'
    },{
        path: 'reviews',
        populate: {
            path: 'userId',
            select : 'username image location.fullAddress'
        }
    }
    ]);
    
    if(!residence) next(new appError("Residence not found!", 404));

    if(!residence.isCompleted){
        if( residence.images.length != 0){
            let public_ids = residence.images.map((img) => img.public_id);
            await deleteMultipleImages(public_ids);
        }
        await residence.deleteOne();
        return next(new appError("Residence not found!", 404));
    }
    return res.status(200).json({
        status: 'success',
        residence
    });
});
exports.getNearestResidences = asyncHandler(async (req, res, next) => {
    const {longitude, latitude} = req.user.location;

    if(!longitude || !latitude) return next(new appError("Please provide a valid location", 400));
    
    const residences = await Residence.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [Number(longitude), Number(latitude)]
                },
                $maxDistance: 3000 // 3km
            }
        }
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
    ]);

    return res.status(200).json({
        status: 'success',
        count : residences.length,
        residences
    });
});
exports.getPending = asyncHandler(async (req, res, next) => {
    const {_id} = req.user;
    const residence = await Residence.find({ownerId: _id, status: "pending", isCompleted: true}).populate([
    { 
        path: 'ownerId',
        select: 'username  image location.fullAddress'
    },{
        path: 'reviews',
        populate: {
            path: 'userId',
            select : 'username image location.fullAddress'
        }
    }
    ]);
    residence.map(res => res.neighborhood = neighborhoodConverter(res.neighborhood));

    return res.status(200).json({
        status: 'success',
        count : residence.length,
        residence
    });
});
exports.getApproved = asyncHandler(async (req, res, next) => {
    const {_id} = req.user;
    const residence = await Residence.find({ownerId: _id, status: "approved", isCompleted: true}).populate([
    { 
        path: 'ownerId',
        select: 'username  image location.fullAddress'
    },{
        path: 'reviews',
        populate: {
            path: 'userId',
            select : 'username image location.fullAddress'
        }
    }
    ]);
    residence.map(res => res.neighborhood = neighborhoodConverter(res.neighborhood));

    return res.status(200).json({
        status: 'success',
        count : residence.length,
        residence
    });
});
exports.getSold =  asyncHandler(async (req, res, next) => {
    const {_id} = req.user;
    const residence = await Residence.find({ownerId: _id, isSold: true, isCompleted: true}).populate([
    { 
        path: 'ownerId',
        select: 'username  image location.fullAddress'
    },{
        path: 'reviews',
        populate: {
            path: 'userId',
            select : 'username image location.fullAddress'
        }
    }
    ]);
    residence.map(res => res.neighborhood = neighborhoodConverter(res.neighborhood));

    return res.status(200).json({
        status: 'success',
        count : residence.length,
        residence
    });
});





exports.updateResidence = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const {value, error} = updateResidenceValidation(req.body);
    if(error) return next(new appError(error, 400));

    valueConversion(value);
    if(value.utilities){
        if(! value.utilities.includes('electricity')) return next(new appError("electricity is required", 400))
    switch(value.utilities.length) {
        case 3:
            value.utilities = 'AllPub';
            break;
        case 1:
            value.utilities = 'ELO';
            break;
        default:
            value.utilities = value.utilities.includes('gas') ? 'NoSeWa' : value.utilities.includes('water') ? 'NoSewr' : value.utilities;
            break;
    }
    }
    
    const residence = await Residence.findByIdAndUpdate(residenceId, value, {new: true});
    if(!residence) next(new appError("Residence not found!", 404));
    
    return res.status(200).json({
        status: 'success',
        residence
    });
});
exports.deleteOneResidence = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const residence = await Residence.findById(residenceId);
    if(!residence) next(new appError("Residence not found!", 404));
    
    if( residence.images.length != 0){
        let public_ids = residence.images.map((img) => img.public_id);
        await deleteMultipleImages(public_ids);
    }
    const user = await User.findOne({wishlist: residenceId});

    if (user && user.wishlist) {
        user.wishlist = user.wishlist.filter((fav) => fav.toString() !== residenceId);
        await user.save();
    }

    const reviews = await Review.find({residenceId});
    if(reviews){
        for(const review of reviews){
            await review.deleteOne();
        }
    }
    await residence.deleteOne();
    
    return res.status(200).json({
        status: 'success',
        message: "Residence deleted successfully"
    });
});

exports.filtration = asyncHandler(async (req, res, next) => {
    let {min, max, rating, bedroom, bathroom, neighborhood} = req.query;
    neighborhood = neighborhoodConverter(neighborhood);
   
    if(!min) min = 0;
    if(!max) max = 15000;
    if(!bedroom)  bedroom = 1
    if(!bathroom) bathroom = 1
    
    if(bedroom == 7) bedroom = { $eq: bedroom }; else bedroom = { $gte: bedroom };
    let residences = await Residence.find({
        $and: [
            { salePrice    : { $gte: min, $lte: max } },
            { bedroomAbvGr :  bedroom  },
            { totalbaths   : { $gte: bathroom } },
        ]
    }).populate([
        {
            path: 'reviews',
            select: 'rating',
        }
    ]).select('title salePrice location.fullAddress images category neighborhood bedroomAbvGr totalbaths ');

    if(rating)
    residences = residences.filter(residence => 
        residence.reviews.some(review => review.rating >= rating)
    );
    
    if(neighborhood) residences = residences.filter(residence => residence.neighborhood === neighborhood);
    
    return res.status(200).json({
        status: 'success',
        count: residences.length,
        residences
    });
});

async function  deleteUncompletedResidence(Residence){
    let unCompletedResidences = await Residence.find({ isCompleted: false });
    let public_ids = unCompletedResidences.flatMap(residence => residence.images.map(img => img.public_id));
    if (public_ids.length > 0) {
        await deleteMultipleImages(public_ids);
    }
    await Residence.deleteMany({ isCompleted: false } );
}

