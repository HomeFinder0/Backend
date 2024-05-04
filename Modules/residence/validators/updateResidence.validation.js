const Joi = require("joi");
const errorUpdate = require("../../common/validation/error.update.js");

exports.updateResidenceValidation = function (residence) {
    const residenceSchema = Joi.object({
        title        : Joi.string().messages({ "string.empty": "Title is required" }),
        type         : Joi.string().valid("rent", "sale").trim().lowercase().messages({"string.empty": "Type is required","any.only": "Type must be rent or sale" }),
        category     : Joi.string().valid("apartment", "house", "hotel", "villa",  "cottage").lowercase().trim().messages({"string.empty": "Category is required","any.only": "Category must be apartment, house, hotel, villa or cottage" }),
        mszoning     : Joi.string().valid('agricultural', 'commercial', 'floating village', 'industrial', 'high residential','low', 'park', 'medium' ).lowercase()
        .messages({ "string.empty": "zoning is required", "any.only": "zoning must be agricultural, commercial, industrial , high residential, low,medium or park "}),
        
        neighborhood : Joi.string().valid('bloomington heights',  'bluestem', 'briardale', 'clear creek', 'college creek', 'crawford', 'edwards','gilbert',  'iowa dot and rail road',
        'meadow village', 'mitchell', 'north ames', 'northridge', 'northpark villa', 'northridge heights', 'northwest ames', 'old town', 'sawyer', 'sawyer west', 'somerset', 'stone brook', 'timberland', 'veenker', 'south & west of iowa state university')
        .lowercase().messages({ "string.empty": "Neighborhood is required", "any.only": "Neighborhood must be within Ames city limits ",}),
        

        salePrice    : Joi.number().messages({ "number.type": "Sale price must be a number" }),
        saleCondition: Joi.string().valid('normal', 'abnormal', 'adjoining land purchase', 'allocation', 'family', 'partial').lowercase().messages({
            "string.empty": "Sale condition is required",  "any.only": "Sale condition must be normal, abnormal, adjoining land purchase , family, partial or allocation"}),
        moSold       : Joi.number().messages({ "number.type": "Month sold must be a number" }).min(1).max(12),
        saleType     : Joi.string().valid('conventional', 'cash', 'va Loan', 'new', 'court officer deed/estate', 'contract 15% Down payment regular terms', 'contract Low down payment and low intere', 'contract low interest', 'contract low gown', 'other').lowercase().messages({ "string.empty": "Sale type is required","any.only": "Sale type must be Conventional, Cash, VA Loan, New, Court Officer Deed/Estate, Contract 15% Down payment regular terms, Contract Low Down payment and low intere, Contract Low Interest, Contract Low Down or Other" }),
        paymentPeriod : Joi.string().valid('monthly', 'yearly').lowercase().messages({"string.empty":"Payment period is required", "any.only":"Payment period must be monthly or yearly"}),

        
        bedroomAbvGr  : Joi.number().messages({ "number.type": "bedrooms must be a number" }).min(1),
        totalbaths    : Joi.number().messages({ "number.type": "total baths must be a number" }).min(1).max(7),
        KitchenAbvGr  : Joi.number().messages({ "number.type": "Kitchens must be a number" }).min(1),
        kitchenQual   : Joi.string().valid('excellent', 'good', 'average', 'fair' , 'poor').lowercase().messages({"any.only": "kitchen quality must be excellent, good, average, fair or poor" }),
        totRmsAbvGrd  : Joi.number().messages({ "number.type": "total rooms must be a number" }).min(1),
        
        
        utilities: Joi.string().valid('all', 'electricity only', 'electricity and gas only', 'electricity, gas and water').lowercase().messages({ 
            "string.empty": "Utilities is required", "any.only": "Utilities must be 'all', 'electricity only', 'electricity and gas only' or 'electricity, gas and water'" }),
        lotShape    : Joi.string().valid('regular', 'slightly', 'moderately', 'irregular').lowercase().messages({
            "string.empty": "Lot shape is required", "any.only": "Lot shape must be regular, slightly, moderately or irregular" }),
        electrical: Joi.string().valid('standard circuit breakers & romex', 'average', 'poor', 'fair' ,'mixed').lowercase().messages({ 
            "string.empty": "Electrical is required","any.only": "Electrical must be  'average', 'poor', 'fair' , 'mixed' or 'standard circuit breakers & romex'" }),
        foundation: Joi.string().valid('slab', 'stone', 'wood', 'cinder block', 'brick and tile', 'poured contrete').lowercase().messages({
            "string.empty": "Foundation is required","any.only": "Foundation must be slab, stone, wood, cinder block, brick and tile or poured contrete"}),
        bldgType: Joi.string().valid('single family', 'duplex', 'townhouse end unit', 'townhouse inside unit', '2 family conversion').lowercase().messages({
            "string.empty": "Building type is required", "any.only": "Building type must be single family, duplex, townhouse end unit, townhouse inside unit or 2 family conversion"}),

        hasGarage    : Joi.boolean().messages({ "boolean.empty": "isGarage attribute is required"    }),
        hasBasement  : Joi.boolean().messages({ "boolean.empty": "basement attribute is required" }),
        hasFireplace : Joi.boolean().messages({ "boolean.empty": "isFireplace attribute is required" }),

        roofStyle: Joi.string().valid('Flat', 'Gable', 'Gambrel', 'Hip', 'Mansard', 'Shed').messages({ 
            "string.empty": "Roof style is required",
            "any.only":  "Roof style must be Flat, Gable, Gambrel, Hip, Mansard or Shed" }),
        roofMatl: Joi.string().valid('clay or tile', 'standard shingle', 'membran', 'metal', 'roll', 'gravel & tar', 'wood shakes', 'wood shingles').lowercase() 
        .messages({ 
            "string.empty": "Roof material is required",
            "any.only":  "Roof material must be 'clay or tile', standard shingle, membran, metal, roll, 'gravel & tar', wood shakes, wood shingles" }), 
        houseStyle    :Joi.string().valid('1Story', '1.5Fin', '1.5Unf', '2Story', '2.5Fin', '2.5Unf', 'SFoyer', 'SLvl')
        .messages({ "string.empty": "House style is required","any.only":  "House style must be'1Story', '1.5Fin', '1.5Unf', '2Story', '2.5Fin', '2.5Unf', 'SFoyer' or 'SLvl'" }),

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
            then: Joi.string().required().valid('2 types', 'attached', 'basement', 'built in', 'car port', 'detached', 'not available').lowercase()
        .messages({ "any.only": "Garage type must be 2 types, attached, basement, built in, car port, detached or not available" }),
        otherwise: Joi.string().not('')

        }),
        garageQual  : Joi.any().when('hasGarage',{
            is:true,
            then: Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor', 'not available').lowercase()
        .messages({"any.only": "Garage quality must be excellent, good, average, fair, poor or not available" }),
        otherwise: Joi.string().not('')

        }),
        
        bsmtExposure: Joi.any().when('hasBasement', {
            is:true,
            then: Joi.string().required().valid('good', 'average', 'minimum', 'no exposure').lowercase()
        .messages({"any.only": "Basement exposure must be good, average, minimum or no exposure" }),
            otherwise: Joi.string().not('')
        }),
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
        otherwise: Joi.string().not('')
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
            otherwise: Joi.string().not('')
    }),
    fireplaces   : Joi.any().when('hasFireplace', { 
            is:true,
            then: Joi.number().required().messages({ "number.type": "fireplaces must be a number"  }),
        }),
        fireplaceQu  : Joi.any().when('hasFireplace', { is:true, then: Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase()
        .messages({"any.only": "fireplaceQu must be excellent, good, average, fair or poor"  }),
        otherwise: Joi.string().not('')
    }),
    alley : Joi.string().valid('gravel', 'paved','no alley access').lowercase().messages({"any.only": "Alley access must be gravel , paved or no alley access"}),

    centralAir    : Joi.string().valid('no','yes').messages({"string.empty": "Central air is required", "any.only": "Central air must be no or yes"}),
    street    : Joi.string().valid('gravel', 'paved').lowercase().messages({ "string.empty": "Street is required" , "any.only": "Street must be gravel or paved" }),      
    heating    : Joi.string().valid('floor','gas', 'gas water', 'gravity', 'other water', 'wall').lowercase().messages({ 
        "string.empty": "Heating is required",   "any.only": "Heating must be floor, gas, gas water, gravity, other water or wall" }),
    heatingQc : Joi.string().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase().messages({
        "string.empty": "Heating quality is required","any.only": "Heating quality must be excellent, good, average, fair or poor"}),   
    
    exterior1st: Joi.string().valid('asbestos shingles', 'asphalt shingles', 'brick face', 'brick common', 'cement board', 'hardboard', 'hardboard siding', 'metal siding' , 'plywood', 'Other', 'precast concrete', 'stucco','vinyl siding', 'wood siding', 'wood shingles','cinder block').lowercase().messages({
        "string.empty": "Exterior 1st is required", "any.only": "Exterior 2nd must be asbestos shingles, asphalt shingles, brick face, brick common, cement board, hardboard, hardboard siding, metal siding, plywood, Other, precast concrete, stucco, vinyl siding, wood siding, wood shingles or cinder block"}),  
    exterior2nd: Joi.string().valid('asbestos shingles', 'asphalt shingles', 'brick face', 'brick common', 'cement board', 'hardboard', 'hardboard siding', 'metal siding' , 'plywood', 'Other', 'precast concrete', 'stucco','vinyl siding', 'wood siding', 'wood shingles','cinder block').lowercase().messages({ 
        "string.empty": "Exterior 2nd is required", "any.only": "Exterior 2nd must be asbestos shingles, asphalt shingles, brick face, brick common, cement board, hardboard, hardboard siding, metal siding, plywood, Other, precast concrete, stucco, vinyl siding, wood siding, wood shingles or cinder block"}),  
    exterCond   : Joi.string().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase().messages({
        "string.empty": "Exterior condition is required", "any.only": "Exterior condition must be excellent, good, average, fair or poor" }),
    exterQual   : Joi.string().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase().messages({
        "string.empty": "Exterior quality is required", "any.only": "Exterior quality must be excellent, good, average, fair or poor"}),
        poolArea: Joi.number().messages({ "number.type": "poolArea must be a number" }),
        overallQual     : Joi.number().messages({ "number.type": "overall material quality must be a number" }).min(1).max(10),
        overallCond     : Joi.number().messages({ "number.type": "overall condition must be a number" }).min(1).max(10),
    
        lotFrontage     : Joi.number().messages({ "number.type": "lot frontage must be a number" }),
        lotArea         : Joi.number().messages({ "number.type": "lot area must be a number" }),
        
        totalsf         : Joi.number().messages({ "number.type": "total square footage must be a number" }),
        totalarea       : Joi.number().messages({ "number.type": "total area must be a number" }),
        totalporchsf    : Joi.number().messages({ "number.type": "total porch square footage must be a number" }),
        
        masVnrArea      : Joi.number().messages({ "number.type": "masonry veneer area must be a number" }),
        masVnrType: Joi.string().valid("brick face", "brick common", "cinder block", "stone" , "none").lowercase().messages({
            "string.empty": "Masonry veneer type is required",
            "any.only": "Masonry veneer type must be brick face, brick common, cinder block, Stone or None "
        }),
        lotConfig   : Joi.string().valid('inside', 'corner', 'cul de sac', 'frontage on 2', 'frontage on 3').lowercase()
        .messages({ "string.empty": "Lot configuration is required", "any.only": "Lot configuration must be inside, corner, cul de sac, frontage on 2 or frontage on 3" }),
        landContour : Joi.string().valid('level', 'banked', 'hillside', 'depression').lowercase()
        .messages({ "string.empty": "Land contour is required", "any.only": "Land contour must be level, banked, hillside or depression"}),
        landSlope   : Joi.string().valid('gentle', 'moderate', 'severe').lowercase()
        .messages({ "string.empty": "Land slope is required", "any.only": "Land slope must be gentle, moderate or severe" }),

        condition1  : Joi.string().valid('normal', 'adjacent to feeder street', 'adjacent to arterial street',  "adjacent to east west railroad" , 
        'adjacent to north south', 'within 200 of east west', 'within 200 of north South', 'adjacent to positive off site feature','near positive off-site feature').lowercase()
        .messages({ "string.empty": "Proximity to various conditions is required", "any.only":  " Proximity to various conditions must be 'normal', 'adjacent to feeder street', 'adjacent to arterial street',  'adjacent to east west railroad', 'adjacent to north south', 'within 200 of east west', 'within 200 of north South', 'adjacent to positive off site feature' or 'near positive off-site feature' "}),
       
        condition2  : Joi.string().valid('normal', 'adjacent to feeder street', 'adjacent to arterial street',  "adjacent to east west railroad" , 
        'adjacent to north south', 'within 200 of east west', 'within 200 of north South', 'adjacent to positive off site feature','near positive off-site feature').lowercase()
        .messages({"any.only": "Invalid value of Proximity to various conditions"}),
    
        pavedDrive : Joi.string().valid('paved', 'gravel', 'partial')
        .messages({ "string.empty": "Paved drive is required", "any.only": "Paved drive must be paved, gravel or partial" }),
    
        houseage        : Joi.number().messages({ "number.type": "house age must be a number" }),
        houseremodelage : Joi.number().messages({ "number.type": "house remodel age must be a number" }),

            miscVal         : Joi.number().messages({ "number.type": "miscellaneous value must be a number" }),
        lowQualFinSF    : Joi.number().messages({ "number.type": "low quality finished square footage must be a number" }),

        msSubClass      : Joi.string().valid("2 family conversion", "multilevel and split", "duplex", "split foyer","multi-level", 
         "1 story unfinished attic","1 story finished attic", "2story and older", "2story and newer",  "1story and older", "1story and newer" )
         .messages({"string.empty": "msSubClass is required", "any.only": "msSubClass must be 2 family conversion, multilevel and split, duplex, split foyer, multi-level, 1 story unfinished attic, 1 story finished attic, 2story and older, 2story and newer, 1story and older or 1story and newer" }),


    }).unknown();
    
        let { error, value } = residenceSchema.validate(residence);
        if (error) error = errorUpdate(error);
        return { value, error };
};