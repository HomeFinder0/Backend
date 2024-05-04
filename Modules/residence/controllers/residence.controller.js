const asyncHandler = require("express-async-handler");
const appError = require("../../../Helpers/appError.js");

const Residence = require('../models/Residence.js');
const Review = require('../../Review/models/Review.js');
const User = require('../../user/models/User.js');

const {
    uploadImage,
    deleteImage
} = require("../../../Helpers/cloud.js");
const getLocation = require("../../../Managers/getLocation.manager.js");
const { 
    residenceValidation,
    completeResidenceValidation,
    stepTwoCompleteValidation,
    stepThreeCompleteValidation,
} = require("../validators/residence.validation.js");

const { updateResidenceValidation } = require("../validators/updateResidence.validation.js");

const { 
    neighborhoodConverter,   mszoningConverter,
    utilitiesConverter,      qualityRatingConverter,
    roofMaterialsConverter,  garageConverter,
    saleTypeConverter,       electricalConverter,    
    streetConverter,         bsmtExposureConverter,
    bsmtFinType1Converter,   pavedDriveConverter,
    masVnrTypeConverter,     condConverter,
    exteriorConverter,       landSlopeConverter,
    landContourConverter,    heatingConverter, 
    lotShapeConverter,       lotConfigConverter, 
    centralAirConverter,     saleConditionConverter,
    msSubClassConverter,     bldgTypeConverter,
    foundationConverter,     alleyConverter
    } = require("../../../Helpers/converter.js");

exports.createResidence = asyncHandler(async (req, res, next) => {
    const user = req.user;
    const {value, error} = residenceValidation(req.body);
    if(error) return next(new appError(error, 400));

    value.neighborhood  = neighborhoodConverter(value.neighborhood);
    value.saleCondition = saleConditionConverter(value.saleCondition);
    value.saleType      = saleTypeConverter(value.saleType);
    value.kitchenQual   = qualityRatingConverter(value.kitchenQual);
    value.mszoning      = mszoningConverter(value.mszoning);
    value.utilities     = utilitiesConverter(value.utilities);
    value.lotShape      = lotShapeConverter(value.lotShape);   
    value.electrical    = electricalConverter(value.electrical);
    value.foundation    = foundationConverter(value.foundation);
    value.bldgType      = bldgTypeConverter(value.bldgType);
    
    const residence = await Residence.create({...value, ownerId: user._id});
    
    await residence.save();
    
    res.status(201).json({
        status: "success",
        residence
    });
});

exports.completeResidence = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const {value, error} = completeResidenceValidation(req.body);
    if(error) return next(new appError(error, 400));
    
    value.masVnrType   = masVnrTypeConverter(value.masVnrType);
    value.centralAir   = centralAirConverter(value.centralAir);
    value.roofMatl     = roofMaterialsConverter(value.roofMatl);
    value.street       = streetConverter(value.street);
    value.alley        = alleyConverter(value.alley);
    value.heating      = heatingConverter(value.heating);
    value.heatingQc    = qualityRatingConverter(value.heatingQc);
    value.exterior2nd  = exteriorConverter(value.exterior2nd);
    value.exterior1st  = exteriorConverter(value.exterior1st);
    value.exterCond    = qualityRatingConverter(value.exterCond);
    value.exterQual    = qualityRatingConverter(value.exterQual);
    value.msSubClass   = msSubClassConverter(value.msSubClass);
    value.condition1   = condConverter(value.condition1);
    value.condition2   = condConverter(value.condition2);

    const residence = await Residence.findByIdAndUpdate(residenceId, value, {new: true});
    if(!residence) next(new appError("Residence not found!", 404));

    return res.status(200).json({
        status:"success",
        residence
    });
});

exports.stepTwoComplete = asyncHandler( async(req, res, next) => {
    const {residenceId} = req.params;
    const {value, error} = stepTwoCompleteValidation(req.body);
    if(error) return next(new appError(error, 400));
    console.log(value.bsmtExposure)
    if(value.hasGarage){ 
        value.garageType   = garageConverter(value.garageType);
        value.garageFinish = garageConverter(value.garageFinish);
        value.garageQual   = qualityRatingConverter(value.garageQual);
    }
    if(value.hasBasement) { 
        value.bsmtFinType1  = bsmtFinType1Converter(value.bsmtFinType1);
        value.bsmtExposure  = bsmtExposureConverter(value.bsmtExposure);
        value.bsmtCond      = qualityRatingConverter(value.bsmtCond);
        value.bsmtQual      = qualityRatingConverter(value.bsmtQual);

        console.log("After conversion: ",value.bsmtExposure)
    }
    if(value.hasFireplace)  value.fireplaceQu = qualityRatingConverter(value.fireplaceQu);
    value.kitchenQual  = qualityRatingConverter(value.kitchenQual);
   
    const residence = await Residence.findByIdAndUpdate(residenceId, value, {new: true});
    if(!residence) next(new appError("Residence not found!", 404));

    return res.status(200).json({
        status:"success",
        residence
    });
});

exports.stepThreeComplete = asyncHandler( async(req, res, next) => {
    const {value, error} = stepThreeCompleteValidation(req.body);
    if(error) return next(new appError(error, 400));
    
    const {residenceId} = req.params;

    value.lotConfig    = lotConfigConverter(value.lotConfig);
    value.landContour  = landContourConverter(value.landContour);
    value.landSlope    = landSlopeConverter(value.landSlope);
    value.pavedDrive   = pavedDriveConverter(value.pavedDrive);

    const residence = await Residence.findByIdAndUpdate(residenceId, value, {new: true}).populate({
        path: 'ownerId',
        select: 'username  location.fullAddress image'});

    if(!residence) next(new appError("Residence not found!", 404));
    
    return res.status(200).json({
        status: 'success',
        residence
    });
})
exports.residenceImages = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const residence = await Residence.findById(residenceId);
    if(!residence) next(new appError("Residence not found!", 404));
    if(! req.files) next(new appError("please, upload an image", 400));
    
    for (const file of req.files) {
        const image = await uploadImage(residenceId, file.path);
        residence.images.push(image);
    }

    await residence.save();
    res.status(200).json({
        status: "success",
        residence
    });
});


exports.setLocation = asyncHandler(async (req, res, next) => {
    const { longitude, latitude } = req.query;
    const { residenceId } = req.params;

    if (!longitude || !latitude)   return next(new appError("Please provide a valid location", 400));
    
    const residence = await Residence.findById(residenceId);
    if (!residence) return next(new appError("Residence not found!", 404));

    residence.location = {
        longitude: Number(longitude),
        latitude : Number(latitude),
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
      location,
    });
    });

exports.updateResidence = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const {value, error} = updateResidenceValidation(req.body);
    if(error) return next(new appError(error, 400));
    
    const residence = await Residence.findByIdAndUpdate(residenceId, value, {new: true});
    if(!residence) next(new appError("Residence not found!", 404));
    
    return res.status(200).json({
        status: 'success',
        residence
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
    
    return res.status(200).json({
        status: 'success',
        residence
    });
});

exports.getAllResidences = asyncHandler(async (req, res, next) => {
    const page  = req.query.page  * 1 || 1;
    const limit = 10;
    const skip  = (page - 1) * limit;

    const residences = await Residence.find().populate({
        path: 'ownerId',
        select: 'username image location.fullAddress'
    }).populate({
        path: 'reviews',
        populate: {
            path: 'userId',
            select : 'username image location.fullAddress'
        }
    }).skip(skip).limit(limit);

    return res.status(200).json({
        status: 'success',
        residences
    });
});

exports.deleteOneResidence = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const residence = await Residence.findById(residenceId);
    if(!residence) next(new appError("Residence not found!", 404));
    
    if( residence.images.length != 0){
        for(const image of residence.images){
            await deleteImage(image.public_id);
        }
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

    let residences = await Residence.find({
        $and: [
            { salePrice    : { $gte: min, $lte: max } },
            { bedroomAbvGr : { $lte: bedroom } },
            { totalbaths   : { $lte: bathroom } },
            { neighborhood : neighborhood },
        ]
    }).populate([
        {
            path: 'reviews',
            select: 'rating',
        }
    ]).select('title salePrice location.fullAddress images category');
    if(rating)
    residences = residences.filter(residence => 
        residence.reviews.some(review => review.rating >= rating)
      );
    return res.status(200).json({
        status: 'success',
        count: residences.length,
        residences
    });
});
