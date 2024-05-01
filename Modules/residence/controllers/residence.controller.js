const asyncHandler = require("express-async-handler");
const appError = require("../../../Helpers/appError.js");
const Residence = require('../models/Residence.js');
const User = require('../../user/models/User.js');
const {
    uploadImage,
    deleteImage
} = require("../../../Helpers/cloud.js");
const { 
    residenceValidation,
    completeResidenceValidation ,
    finalStepValidation,
    updateResidenceValidation
} = require("../validators/residence.validation.js");

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
    foundationConverter,     bldTypeConverter, saleConditionConverter
    } = require("../../../Helpers/converter.js");

exports.createResidence = asyncHandler(async (req, res, next) => {
    const user = req.user;
    const {value, error} = residenceValidation(req.body);
    if(error) return next(new appError(error, 400));

    value.neighborhood  = neighborhoodConverter(value.neighborhood);
    value.saleCondition = saleConditionConverter(value.saleCondition);
    value.saleType      = saleTypeConverter(value.saleType);
    value.roofMatl      = roofMaterialsConverter(value.roofMatl);
    value.kitchenQual   = qualityRatingConverter(value.kitchenQual);
    value.mszoning      = mszoningConverter(value.mszoning);
    
    if(value.salePrice == 0 ) return next(new appError("please, add a correct price", 400));
    const residence = await Residence.create({...value, ownerId: user._id});

    if(value.hasGarage){ 
        residence.hasGarage = value.hasGarage;
        setGarageProperties(residence, value);
    }
    if(value.hasFireplace){
        residence.hasFireplace  = value.hasFireplace;
        setFirePlaceProperties(residence, value);
    }

    if(value.hasBasement){
        residence.hasBasement = value.hasBasement;
        setBasementProperties(residence, value)
    }
    await residence.save();
    res.status(201).json({
        status: "success",
        residence
    });
});

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

exports.completeResidence = asyncHandler(async (req, res, next) => {
    const {residenceId} = req.params;
    const {value, error} = completeResidenceValidation(req.body);
    if(error) return next(new appError(error, 400));
    
    const residence = await Residence.findById(residenceId);
    if(!residence) next(new appError("Residence not found!", 404));
    
    residence.street       = streetConverter(value.street);
    residence.foundation   = foundationConverter(value.foundation);
    residence.bldgType     = bldTypeConverter(value.bldgType);
    residence.heating      = heatingConverter(value.heating);
    residence.heatingQc    = qualityRatingConverter(value.heatingQc);
    residence.electrical   = electricalConverter(value.electrical);
    residence.utilities    = utilitiesConverter(value.utilities);
    residence.lotShape     = lotShapeConverter(value.lotShape);   
    residence.lotConfig    = lotConfigConverter(value.lotConfig);
    residence.landContour  = landContourConverter(value.landContour);
    residence.landSlope    = landSlopeConverter(value.landSlope);
    residence.condition1   = condConverter(value.condition1);
    residence.condition2   = condConverter(value.condition2);
    residence.exterior2nd  = exteriorConverter(value.exterior2nd);
    residence.exterior1st  = exteriorConverter(value.exterior1st);
    residence.masVnrType   = masVnrTypeConverter(value.masVnrType);
    residence.pavedDrive   = pavedDriveConverter(value.pavedDrive);
    residence.exterCond    = qualityRatingConverter(value.exterCond);
    residence.exterQual    = qualityRatingConverter(value.exterQual);

    await residence.save();
    return res.status(200).json({
        status:"success",
        residence
    });
});

exports.finalStep = asyncHandler( async(req, res, next) => {
    const {value, error} = finalStepValidation(req.body);
    if(error) return next(new appError(error, 400));
    
    const {residenceId} = req.params;
    const residence = await Residence.findByIdAndUpdate(residenceId, value, {new: true}).populate({
        path: 'ownerId',
        select: 'username email phone location.fullAddress image'})
    
    if(!residence) next(new appError("Residence not found!", 404));
    
    return res.status(200).json({
        status: 'success',
        residence
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
    const residence = await Residence.findById(residenceId).populate('ownerId').populate('reviews');
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
        select: 'username email phone location.fullAddress image'
    }).populate({
        path: 'reviews',
        populate: {
            path: 'userId',
            select : 'username image'
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
    await residence.deleteOne();
    
    return res.status(200).json({
        status: 'success',
        message: "Residence deleted successfully"
    });
});

function setFirePlaceProperties(residence, value) {
    residence.fireplaces = value.fireplaces;
    residence.fireplaceQu = qualityRatingConverter(value.fireplaceQu);
}
function setGarageProperties(residence, value) {
    residence.garageCars   = value.garageCars;
    residence.garageType   = garageConverter(value.garageType);
    residence.garageFinish = garageConverter(value.garageFinish);
    residence.garageQual   = qualityRatingConverter(value.garageQual);
}

function setBasementProperties(residence, value){
    residence.bsmtFinType1  = bsmtFinType1Converter(value.bsmtFinType1);
    residence.bsmtExposure  = bsmtExposureConverter(value.bsmtExposure);
    residence.BsmtCond      = qualityRatingConverter(value.BsmtCond);
    residence.bsmtQual      = qualityRatingConverter(value.bsmtQual);
    residence.bsmtUnfSF     = value.bsmtUnfSF;
}