const asyncHandler = require("express-async-handler");
const appError = require("../../../Helpers/appError.js");
const axios = require("axios");

const Residence = require('../models/Residence.js');
const Review = require('../../Review/models/Review.js');
const User = require('../../user/models/User.js');

const {
    uploadImageWithoutFolder,
    deleteImage
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
    const {value, error} = residenceValidation(req.body);
    if(error) return next(new appError(error, 400));
    
    let residence = await Residence.create({...value, ownerId: user._id});
    if(!residence) next(new appError("Unable to create residence", 500));
    
    residence = {
        _id        : residence._id,
        title      : residence.title,
        type       : residence.type,       
        category   : residence.category,
        ownerId    : residence.ownerId
    };

    res.status(201).json({
        status: "success",
        residence
    });
});
exports.stepOneUpdate = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    let value, error;

    if(req.route.path == "/complete/1st/:residenceId") {
        ({value, error} = stepOneCompleteValidation(req.body));
    } else {
        ({value, error} = updateValidation(req.body));
    }

    if (error) return next(new appError(error, 400));

    valueConversion(value);
    
    let residence = await Residence.findByIdAndUpdate(residenceId, value, {new: true});
    if(!residence) next(new appError("Residence not found!", 404));

   // await residence.save();
    
    residence = {
        _id : residence._id,
        neighborhood  : residence.neighborhood ,   
        mszoning      : residence.mszoning,   
        saleCondition : residence.saleCondition , 
        moSold        : residence.moSold,   
        salePrice     : residence.salePrice,
        paymentPeriod : residence.paymentPeriod,
        saleType      : residence.saleType,
        utilities     : residence.utilities,   
        lotShape      : residence.lotShape,    
        electrical    : residence.electrical, 
        foundation    : residence.foundation ,      
        bldgType      : residence.bldgType,
        ownerId       : residence.ownerId
    }

    res.status(200).json({
        status: "success",
        residence
    });
});
exports.stepTwoUpdate= asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    let value, error;

    if(req.route.path == "/complete/2nd/:residenceId") {
        ({value, error} = stepTwoCompleteValidation(req.body));
    } else {
        ({value, error} = updateValidation(req.body));
    }
    
    if(error) return next(new appError(error, 400));
    console.log(value)
    valueConversion(value);
    console.log(value)
    
    const residence = await Residence.findByIdAndUpdate(residenceId, value, {new: true});
    if(!residence) next(new appError("Residence not found!", 404));

    return res.status(200).json({
        status:"success",
        residence
    });
});
exports.stepThreeUpdate= asyncHandler( async(req, res, next) => {
    const {residenceId} = req.params;
    let value, error;

    if(req.route.path == "/complete/3rd/:residenceId") {
        ({value, error} = stepThreeCompleteValidation(req.body));
    } else {
        ({value, error} = updateValidation(req.body));
    }
    
    if(error) return next(new appError(error, 400));
    
    valueConversion(value);

    const residence = await Residence.findByIdAndUpdate(residenceId, value, {new: true});
    if(!residence) next(new appError("Residence not found!", 404));

    return res.status(200).json({
        status:"success",
        residence
    });
});
exports.stepFourUpdate = asyncHandler( async(req, res, next) => {
    const {residenceId} = req.params;
    let value, error;

    if(req.route.path == "/complete/4th/:residenceId") {
        ({value, error} = stepFourCompleteValidation(req.body));
    } else {
        ({value, error} = updateValidation(req.body));
    }

    if(error) return next(new appError(error, 400));
    
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
exports.uploadResidenceImages = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const residence = await Residence.findById(residenceId);
    if(!residence) next(new appError("Residence not found!", 404));
    if(! req.files) next(new appError("please, upload an image", 400));
    
    for (const file of req.files) {
        const image = await uploadImageWithoutFolder(file.path, next);
        residence.images.push(image);
    }

    await residence.save();
    res.status(200).json({
        status: "success",
        residenceId : residence._id,
        images: residence.images
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

//Update functions
exports.updateResidence = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const {value, error} = updateValidation(req.body);
    if(error) return next(new appError(error, 400));
    
    let residence = await Residence.findById(residenceId);
    if(!residence) next(new appError("Residence not found!", 404));

    if(req.user._id.toString() != residence.ownerId.toString()) return next(new appError("Unauthorized", 401));
    
    residence = await Residence.findByIdAndUpdate(residenceId, value, {new :true});
    
    return res.status(200).json({
        status: 'success',
        residence
    });
});

//Get functions
exports.getResidenceImages = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const residence = await Residence.findById(residenceId).select('images');
    if(!residence) next(new appError("Residence not found!", 404));
  
    res.status(200).json({
        status: "success",
        residenceId : residence._id,
        images: residence.images
    });
});
exports.getLocation = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const residence = await Residence.findById(residenceId).select('location');
    
    if(!residence) return next(new appError('residence not found!', 404));

    return res.status(200).json({
        status: 'success',
        residenceId : residence._id,
        location: residence.location
    })
});
exports.getAllApproved = asyncHandler(async (req, res, next) => {
    const {_id} = req.user;
    const page  = req.query.page  * 1 || 1;
    const limit = 10;
    const skip  = (page - 1) * limit;
    let residences = await Residence.find({ isCompleted: true, status: 'approved'}).populate({
        path: 'ownerId',
        select:'username image location.fullAddress'
    }).populate({
        path: 'reviews',
        populate: {
            path: 'userId likedBy',
            select : 'username image location.fullAddress',
        }
    }).skip(skip).limit(limit);

  //  await deleteUncompletedResidence(Residence);

    residences = residences.map(res => {
        valueConversion(res);
        return res.toJSON({userId: _id});
    });

    
    return res.status(200).json({
        status: 'success',
        count : residences.length,
        residences
    });
});
exports.getOneResidence = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const {_id} = req.user;
    let residence = await Residence.findById(residenceId).populate([
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
    residence = residence.toJSON( { userId:_id} );
    valueConversion(residence);
    return res.status(200).json({
        status: 'success',
        residence
    });
});
exports.getNearestResidences = asyncHandler(async (req, res, next) => {
    const {longitude, latitude} = req.user.location;
    const {_id} = req.user;
    const page  = req.query.page  * 1 || 1;
    const limit = 10;
    const skip  = (page - 1) * limit;

    if(!longitude || !latitude) return next(new appError("Please provide a valid location", 400));
    
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
        valueConversion(res);
        return res.toJSON({userId: _id});
    });
    
    
    return res.status(200).json({
        status: 'success',
        count : residences.length,
        residences
    });
});
exports.getPending = asyncHandler(async (req, res, next) => {
    const {_id} = req.user;
    const page  = req.query.page  * 1 || 1;
    const limit = 10;
    const skip  = (page - 1) * limit;
    let residences = await Residence.find({ownerId: _id, status: "pending", isCompleted: true}).populate([
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
    ]).skip(skip).limit(limit);

    residences = residences.map(res => {
        valueConversion(res);
        return res.toJSON({userId: _id});
    });


    return res.status(200).json({
        status: 'success',
        count : residences.length,
        residences
    });
});
exports.getApproved = asyncHandler(async (req, res, next) => {
    const {_id} = req.user;
    const page  = req.query.page  * 1 || 1;
    const limit = 10;
    const skip  = (page - 1) * limit;
    let residences = await Residence.find({ownerId: _id, status: "approved", isCompleted: true, isSold: false}).populate([
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
    ]).skip(skip).limit(limit);

    residences = residences.map(res => {
        valueConversion(res);
        return res.toJSON({userId: _id});
    });

    return res.status(200).json({
        status: 'success',
        count : residences.length,
        residences
    });
});
exports.getSold =  asyncHandler(async (req, res, next) => {
    const {_id} = req.user;
    const page  = req.query.page  * 1 || 1;
    const limit = 10;
    const skip  = (page - 1) * limit;
    let residences = await Residence.find({ownerId: _id, isSold: true, isCompleted: true}).populate([
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
    ]).skip(skip).limit(limit);

    residences = residences.map(res => {
        valueConversion(res);
        return res.toJSON({userId: _id});
    });
    return res.status(200).json({
        status: 'success',
        count : residences.length,
        residences
    });
});

//search function
exports.filtration = asyncHandler(async (req, res, next) => {
    let {min, max, rating, bedroom, bathroom, neighborhood} = req.query;
    
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

//Delete functions
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
exports.deleteResidenceImage = asyncHandler(async (req, res, next) => {
    const {imageId} = req.params;
    const residence = await Residence.findOne({images: { $elemMatch: {_id: imageId} }}).select('_id images');

    if(!residence) return next(new appError("Not found!", 404));
    
    let image = residence.images.filter((img)=> img._id == imageId)
    await deleteImage(image[0].public_id);

    residence.images = residence.images.filter( (img) => img._id != imageId);
    await residence.save();
    
    res.status(200).json({
        status: "success",
        message: "Image deleted successfully",
        residenceId : residence._id
    });
});


// function to delete all uncompleted residences
async function  deleteUncompletedResidence(Residence){
    let unUpdatedResidences = await Residence.find({ isCompleted: false });
    let public_ids = unUpdatedResidences.flatMap(residence => residence.images.map(img => img.public_id));
    if (public_ids.length > 0) {
        await deleteMultipleImages(public_ids);
    }
    await Residence.deleteMany({ isCompleted: false } );
};


exports.predictPrice = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    let residence = await Residence.findById(residenceId);
    if(! residence ) return next(new appError("Residence not found!", 400));
    
    residence = residence.mlFeatures();
    try {
        const response = await axios.post(`${process.env.FLASK_URL}/predict`, {
            residence
        });
        console.log(response.data)
        if(response.data.error) return next(new appError(response.data.error, 500))
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }

});