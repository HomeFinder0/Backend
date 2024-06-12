const Joi = require("joi");
const errorUpdate = require("../../common/validation/error.update.js");

exports.residenceValidation = function (residence) {
    const residenceSchema = Joi.object({
        title        : Joi.string().required().messages({ "string.empty": "Title is required" }),
        type         : Joi.string().valid("rent", "sale").trim().required().lowercase().messages({"string.empty": "Type is required","any.only": "Type must be rent or sale" }),
        category     : Joi.string().required().valid("apartment", "house", "hotel", "villa",  "cottage").lowercase().trim().messages({"string.empty": "Category is required","any.only": "Category must be apartment, house, hotel, villa or cottage" }),
        }).unknown();

    let { error, value } = residenceSchema.validate(residence);
    if (error) error = errorUpdate(error);
    return { value, error };
};
exports.stepOneCompleteValidation = function (residence) {
    const residenceSchema = Joi.object({
        mszoning     : Joi.string().required().valid('agricultural', 'commercial', 'floating village', 'industrial', 'high residential','low', 'park', 'medium' ).lowercase()
        .messages({ "string.empty": "zoning is required", "any.only": "zoning must be agricultural, commercial, industrial , high residential, low,medium or park "}),
        
        neighborhood : Joi.string().required().valid('bloomington heights',  'bluestem', 'briardale', 'clear creek', 'college creek', 'crawford', 'edwards','gilbert',  'iowa dot and rail road',
        'meadow village', 'mitchell', 'north ames', 'northridge', 'northpark villa', 'northridge heights', 'northwest ames', 'old town', 'sawyer', 'sawyer west', 'somerset', 'stone brook', 'timberland', 'veenker', 'south & west of iowa state university')
        .lowercase().required().messages({ "string.empty": "Neighborhood is required", "any.only": "Neighborhood must be within Ames city limits ",}),
        

        salePrice    : Joi.number().required().messages({ "number.type": "Sale price must be a number" }).min(100),
        saleCondition: Joi.string().required().valid('normal', 'abnormal', 'adjoining land purchase', 'allocation', 'family', 'partial').lowercase().messages({
            "string.empty": "Sale condition is required",  "any.only": "Sale condition must be normal, abnormal, adjoining land purchase , family, partial or allocation"}),
        moSold       : Joi.number().required().messages({ "number.type": "Month sold must be a number" }).min(1).max(12),
        saleType     : Joi.string().valid('conventional', 'cash', 'va loan', 'new', 'court officer deed/estate', 'contract 15% Down payment regular terms', 'contract Low down payment and low intere', 'contract low interest', 'contract low gown', 'other').lowercase().required().messages({ "string.empty": "Sale type is required","any.only": "Sale type must be Conventional, Cash, VA Loan, New, Court Officer Deed/Estate, Contract 15% Down payment regular terms, Contract Low Down payment and low intere, Contract Low Interest, Contract Low Down or Other" }),
        paymentPeriod : Joi.string().required().valid('monthly', 'yearly').lowercase().messages({"string.empty":"Payment period is required", "any.only":"Payment period must be monthly or yearly"}),
        
        utilities: Joi.array().items(Joi.string().valid('electricity', 'gas', 'water')).required()
        .messages({
            "array.base": "Utilities must be an array",
            "any.required": "Utilities is a required field",
            "string.base": "Each item in utilities must be a string",
            "any.only": "Each item in utilities must be one of ['electricity', 'gas', 'water']"
        }),
            lotShape    : Joi.string().required().valid('regular', 'slightly', 'moderately', 'irregular').lowercase().messages({
            "string.empty": "Lot shape is required", "any.only": "Lot shape must be regular, slightly, moderately or irregular" }),
        electrical: Joi.string().required().valid('standard circuit breakers & romex', 'average', 'poor', 'fair' ,'mixed').lowercase().messages({ 
            "string.empty": "Electrical is required","any.only": "Electrical must be  'average', 'poor', 'fair' , 'mixed' or 'standard circuit breakers & romex'" }),
        foundation: Joi.string().required().valid('slab', 'stone', 'wood', 'cinder block', 'brick and tile', 'poured contrete').lowercase().messages({
            "string.empty": "Foundation is required","any.only": "Foundation must be slab, stone, wood, cinder block, brick and tile or poured contrete"}),
        bldgType: Joi.string().required().valid('single family', 'duplex', 'townhouse end unit', 'townhouse inside unit', '2 family conversion').lowercase().messages({
            "string.empty": "Building type is required", "any.only": "Building type must be single family, duplex, townhouse end unit, townhouse inside unit or 2 family conversion"}),
   
        }).unknown();

    let { error, value } = residenceSchema.validate(residence);
    if (error) error = errorUpdate(error);
    return { value, error };
};
exports.stepTwoCompleteValidation =function (residence) {
    const residenceSchema = Joi.object({
        roofStyle: Joi.string().required().valid('Flat', 'Gable', 'Gambrel', 'Hip', 'Mansard', 'Shed').messages({ 
            "string.empty": "Roof style is required",
            "any.only":  "Roof style must be Flat, Gable, Gambrel, Hip, Mansard or Shed" }),
        roofMatl: Joi.string().required().valid('clay or tile', 'standard shingle', 'membran', 'metal', 'roll', 'gravel & tar', 'wood shakes', 'wood shingles').lowercase() 
        .messages({ 
            "string.empty": "Roof material is required",
            "any.only":  "Roof material must be 'clay or tile', standard shingle, membran, metal, roll, 'gravel & tar', wood shakes, wood shingles" }), 
        houseStyle    :Joi.string().required().valid('1Story', '1.5Fin', '1.5Unf', '2Story', '2.5Fin', '2.5Unf', 'SFoyer', 'SLvl')
            .messages({ "string.empty": "House style is required","any.only":  "House style must be'1Story', '1.5Fin', '1.5Unf', '2Story', '2.5Fin', '2.5Unf', 'SFoyer' or 'SLvl'" }),
        msSubClass      : Joi.string().required().valid("2 family conversion", "multilevel and split", "duplex", "split foyer","multi-level", 
            "1 story unfinished attic","1 story finished attic", "2story and older", "2story and newer",  "1story and older", "1story and newer" )
            .messages({"string.empty": "msSubClass is required", "any.only": "msSubClass must be 2 family conversion, multilevel and split, duplex, split foyer, multi-level, 1 story unfinished attic, 1 story finished attic, 2story and older, 2story and newer, 1story and older or 1story and newer" }),
        centralAir    : Joi.string().required().valid('no','yes').messages({"string.empty": "Central air is required", "any.only": "Central air must be no or yes"}),
        street        : Joi.string().required().valid('gravel', 'paved').lowercase().messages({ "string.empty": "Street is required" , "any.only": "Street must be gravel or paved" }),      
        alley         : Joi.string().valid('gravel', 'paved','no alley access').lowercase().messages({"any.only": "Alley access must be gravel , paved or no alley access"}),
      
        heating    : Joi.string().required().valid('floor','gas', 'gas water', 'gravity', 'other water', 'wall').lowercase().messages({ 
            "string.empty": "Heating is required",   "any.only": "Heating must be floor, gas, gas water, gravity, other water or wall" }),
        heatingQc : Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase().messages({
            "string.empty": "Heating quality is required","any.only": "Heating quality must be excellent, good, average, fair or poor"}),   
        masVnrArea      : Joi.number().required().messages({ "number.type": "masonry veneer area must be a number" }),
        masVnrType: Joi.string().valid("brick face", "brick common", "cinder block", "stone" , "no").lowercase().messages({
            "string.empty": "Masonry veneer type is required","any.only": "Masonry veneer type must be brick face, brick common, cinder block, Stone or no"}),
        exterior1st: Joi.string().required().valid('asbestos shingles', 'asphalt shingles', 'brick face', 'brick common', 'cement board', 'hardboard', 'hardboard siding', 'metal siding' , 'plywood', 'Other', 'precast concrete', 'stucco','vinyl siding', 'wood siding', 'wood shingles','cinder block', 'stone', 'imitation stucco').lowercase().messages({
            "string.empty": "Exterior 1st is required", "any.only": "Exterior 1st must be asbestos shingles, asphalt shingles, brick face, brick common, cement board, hardboard, hardboard siding, metal siding, plywood, Other, precast concrete, stucco, vinyl siding, wood siding, wood shingles , imitation stucco, stone,  or cinder block"}),  
        exterior2nd: Joi.string().required().valid('asbestos shingles', 'asphalt shingles', 'brick face', 'brick common', 'cement board', 'hardboard', 'hardboard siding', 'metal siding' , 'plywood', 'Other', 'precast concrete', 'stucco','vinyl siding', 'wood siding', 'wood shingles','cinder block', 'stone', 'imitation stucco').lowercase().messages({ 
            "string.empty": "Exterior 2nd is required", "any.only": "Exterior 2nd must be asbestos shingles, asphalt shingles, brick face, brick common, cement board, hardboard, hardboard siding, metal siding, plywood, Other, precast concrete, stucco, vinyl siding, wood siding, wood shingles, imitation stucco, stone or cinder block"}),  
        exterCond   : Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase().messages({
            "string.empty": "Exterior condition is required", "any.only": "Exterior condition must be excellent, good, average, fair or poor" }),
        exterQual   : Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase().messages({
            "string.empty": "Exterior quality is required", "any.only": "Exterior quality must be excellent, good, average, fair or poor"}),
         condition1  : Joi.string().required().valid('normal', 'adjacent to feeder street', 'adjacent to arterial street',  "adjacent to east west railroad" , 
            'adjacent to north south', 'within 200 of east west', 'within 200 of north south', 'adjacent to positive off site feature','near positive off-site feature').lowercase()
            .messages({ "string.empty": "Proximity to various conditions 1 is required", "any.only":  " Proximity to various conditions1 must be 'normal', 'adjacent to feeder street', 'adjacent to arterial street',  'adjacent to east west railroad', 'adjacent to north south', 'within 200 of east west', 'within 200 of north South', 'adjacent to positive off site feature' or 'near positive off-site feature' "}),

        condition2  : Joi.string().valid('normal', 'adjacent to feeder street', 'adjacent to arterial street',  "adjacent to east west railroad" , 
            'adjacent to north south', 'within 200 of east west', 'within 200 of north south', 'adjacent to positive off site feature','near positive off-site feature').lowercase()
            .messages({"any.only": "Invalid value of Proximity to various conditions 2  must be 'normal', 'adjacent to feeder street', 'adjacent to arterial street',  'adjacent to east west railroad', 'adjacent to north south', 'within 200 of east west', 'within 200 of north South', 'adjacent to positive off site feature' or 'near positive off-site feature' "}),
                            
   }).unknown();
    
    let { error, value } = residenceSchema.validate(residence);
    if (error) error = errorUpdate(error);
    return { value, error };  
};
exports.stepThreeCompleteValidation =  function (residence){
    const residenceSchema = Joi.object({
        hasGarage   : Joi.boolean().required().messages({ "boolean.empty": "isGarage attribute is required"    }),
        garageFinish: Joi.any().when('hasGarage', { 
            is:true,
            then: Joi.string().required().valid('finished','rough finished' ,'unfinished', 'not available').lowercase().messages({
                "string.empty": "Garage finish is required", "any.only": "Garage finish must be finished, rough finished, unfinished or not available"}),
                otherwise: Joi.string().not('')
            }), 
        garageCars  : Joi.any().when('hasGarage', {
            is:true,
            then: Joi.number().required().messages({ "number.type": "Garage cars must be a number" }).min(1),
        }),
        garageType  : Joi.any().when('hasGarage', {
            is:true,
            then: Joi.string().required().valid('more than one', 'attached', 'basement', 'built in', 'car port', 'detached', 'not available').lowercase()
        .messages({ "any.only": "Garage type must be more than one, attached, basement, built in, car port, detached or not available" }),
        otherwise: Joi.string().not('')

        }),
        garageQual  : Joi.any().when('hasGarage',{
            is:true,
            then: Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor', 'not available').lowercase()
        .messages({"any.only": "Garage quality must be excellent, good, average, fair, poor or not available" }),
        otherwise: Joi.string().not('')

        }),
        
        hasBasement : Joi.boolean().required().messages({ "boolean.empty": "basement attribute is required" }),
        bsmtExposure: Joi.any().when('hasBasement', {
            is:true,
            then: Joi.string().required().valid('good', 'average', 'minimum', 'no exposure').lowercase()
        .messages({"string.empty": "Basement exposure is required.","any.only": "Basement exposure must be good, average, minimum or no exposure" }),
            otherwise: Joi.string().not('')  }),

        bsmtFinType1: Joi.any().when('hasBasement', { 
            is:true, 
            then: Joi.string().required().valid('good', 'average', 'below average', 'average rec room',  'low', 'unfinished' ).lowercase()
        .messages({"any.only": "Basement finish type must be good, average, below average, average rec room, low or unfinished " }),
        otherwise: Joi.string().not('')
    }),
        bsmtQual    : Joi.any().when('hasBasement', { 
            is:true, 
            then: Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase()
        .messages({"any.only": "Basement quality must be excellent, good, average, fair or poor" }),

    }),
        bsmtCond    : Joi.any().when('hasBasement', { 
            is:true, 
            then: Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor', 'not available').lowercase()
        .messages({"any.only": "Basement condition must be excellent, good, average, fair or poor" }),
        otherwise: Joi.string().not('')
    }),
        bsmtUnfSF   : Joi.any().when('hasBasement', { 
            is:true,
            then: Joi.number().required().messages({ "number.type": "Basement unfinished square footage must be a number" }),
    }),
        hasFireplace : Joi.boolean().required().messages({ "boolean.empty": "isFireplace attribute is required" }),
        fireplaces   : Joi.any().when('hasFireplace', { 
            is:true,
            then: Joi.number().required().messages({ "number.type": "fireplaces must be a number"  }),
        }),
        fireplaceQu  : Joi.any().when('hasFireplace', { is:true, then: Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase()
        .messages({"any.only": "fireplaceQu must be excellent, good, average, fair or poor"  }),
        otherwise: Joi.string().not('')
    }),

    bedroomAbvGr  : Joi.number().required().messages({ "number.type": "bedrooms must be a number" }).min(1),
    totalbaths    : Joi.number().required().messages({ "number.type": "total baths must be a number" }).min(1).max(7),
    KitchenAbvGr  : Joi.number().required().messages({ "number.type": "Kitchens must be a number" }).min(1),
    kitchenQual   : Joi.string().required().valid('excellent', 'good', 'average', 'fair' , 'poor').lowercase().messages({"any.only": "kitchen quality must be excellent, good, average, fair or poor" }),
    totRmsAbvGrd  : Joi.number().required().messages({ "number.type": "total rooms must be a number" }).min(1),
    
    });

    let { error, value } = residenceSchema.validate(residence);
    if (error) error = errorUpdate(error);
    return { value, error };  
};
exports.stepFourCompleteValidation = function (residence) {
    const residenceSchema = Joi.object({
        poolArea: Joi.number().messages({ "number.type": "poolArea must be a number" }),
        overallQual     : Joi.number().required().messages({ "number.type": "overall material quality must be a number" }).min(1).max(10),
        overallCond     : Joi.number().required().messages({ "number.type": "overall condition must be a number" }).min(1).max(10),

        lotFrontage     : Joi.number().required().messages({ "number.type": "lot frontage must be a number" }),
        lotArea         : Joi.number().required().messages({ "number.type": "lot area must be a number" }),
        
        totalsf         : Joi.number().required().messages({ "number.type": "total square footage must be a number" }),
        totalarea       : Joi.number().required().messages({ "number.type": "total area must be a number" }),
        totalporchsf    : Joi.number().required().messages({ "number.type": "total porch square footage must be a number" }),
        
    
        lotConfig   : Joi.string().required().valid('inside', 'corner', 'cul de sac', 'frontage on 2', 'frontage on 3').lowercase()
        .messages({ "string.empty": "Lot configuration is required", "any.only": "Lot configuration must be inside, corner, cul de sac, frontage on 2 or frontage on 3" }),
        landContour : Joi.string().required().valid('level', 'banked', 'hillside', 'depression').lowercase()
        .messages({ "string.empty": "Land contour is required", "any.only": "Land contour must be level, banked, hillside or depression"}),
        landSlope   : Joi.string().required().valid('gentle', 'moderate', 'severe').lowercase()
        .messages({ "string.empty": "Land slope is required", "any.only": "Land slope must be gentle, moderate or severe" }),

        pavedDrive : Joi.string().required().valid('paved', 'gravel', 'partial')
        .messages({ "string.empty": "Paved drive is required", "any.only": "Paved drive must be paved, gravel or partial" }),

        houseage        : Joi.number().required().messages({ "number.type": "house age must be a number" }),
        houseremodelage : Joi.number().required().messages({ "number.type": "house remodel age must be a number" }),

        miscVal         : Joi.number().messages({ "number.type": "miscellaneous value must be a number" }),
        lowQualFinSF    : Joi.number().messages({ "number.type": "low quality finished square footage must be a number" }),
}).unknown();

    let { error, value } = residenceSchema.validate(residence);
    if (error) error = errorUpdate(error);
    return { value, error };
};