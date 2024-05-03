const Joi = require("joi");
const errorUpdate = require("../../common/validation/error.update.js");

exports.residenceValidation = function (residence) {
    const residenceSchema = Joi.object({
        title        : Joi.string().required().messages({ "string.empty": "Title is required" }),
        type         : Joi.string().valid("rent", "sale").trim().required().lowercase()
        .messages({"string.empty": "Type is required","any.only": "Type must be rent or sale" }),

        category     : Joi.string().required().valid("apartment", "house", "hotel", "villa",  "cottage").lowercase().trim()
        .messages({"string.empty": "Category is required","any.only": "Category must be apartment, house, hotel, villa or cottage" }),

        neighborhood : Joi.string().required().valid('bloomington heights',  'blueste', 'briardale', 'brookside', 'clear creek', 'college creek', 'crawford', 'edwards','gilbert',  'iowa dot and rail road', 'meadow village').lowercase().required()
        .messages({ "string.empty": "Neighborhood is required",
            "any.only": "Neighborhood must be bloomington heights, blueste, briardale, brookside, clear creek, college creek, crawford, edwards, gilbert, iowa dot and rail road, meadow village" }),

        mszoning     : Joi.string().required().valid('agricultural', 'commercial', 'floating village', 'industrial', 'high residential','low', 'park', 'medium' ).lowercase()
        .messages({ "string.empty": "zoning is required", "any.only": "zoning must be agricultural, commercial, industrial , high residential, low,medium or park "}),

        hasGarage   : Joi.boolean().required().messages({ "boolean.empty": "isGarage attribute is required"    }),
        garageFinish: Joi.any().when('hasGarage', { 
            is:true,
            then: Joi.string().required().valid('finished','rough finished' ,'unfinished', 'not available').lowercase().messages({
                "string.empty": "Garage finish is required",
                "any.only": "Garage finish must be finished, rough finished, unfinished or not available"}),
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
        
        hasBasement : Joi.boolean().required().messages({ "boolean.empty": "basement attribute is required" }),
        bsmtExposure: Joi.any().when('hasBasement', {
            is:true,
            then: Joi.string().required().valid('good', 'average', 'min', 'no exposure').lowercase()
        .messages({"any.only": "Basement exposure must be good, average, min or no exposure" }),
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
        hasFireplace : Joi.boolean().required().messages({ "boolean.empty": "isFireplace attribute is required" }),
        fireplaces   : Joi.any().when('hasFireplace', { 
            is:true,
            then: Joi.number().required().messages({ "number.type": "fireplaces must be a number"  }),
        }),
        fireplaceQu  : Joi.any().when('hasFireplace', { is:true, then: Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase()
        .messages({"any.only": "fireplaceQu must be excellent, good, average, fair or poor"  }),
        otherwise: Joi.string().not('')
    }),
        poolArea: Joi.number().messages({ "number.type": "poolArea must be a number" }),
        roofStyle: Joi.string().required().valid('Flat', 'Gable', 'Gambrel', 'Hip', 'Mansard', 'Shed').messages({ 
            "string.empty": "Roof style is required",
            "any.only":  "Roof style must be Flat, Gable, Gambrel, Hip, Mansard or Shed" }),
        roofMatl: Joi.string().required().valid('clay or tile', 'standard shingle', 'membran', 'metal', 'roll', 'gravel & tar', 'wood shakes', 'wood shingles').lowercase() 
        .messages({ 
            "string.empty": "Roof material is required",
            "any.only":  "Roof material must be 'clay or tile', standard shingle, membran, metal, roll, 'gravel & tar', wood shakes, wood shingles" }), 
        houseStyle    :Joi.string().required().valid('1Story', '1.5Fin', '1.5Unf', '2Story', '2.5Fin', '2.5Unf', 'SFoyer', 'SLvl')
        .messages({ "string.empty": "House style is required","any.only":  "House style must be'1Story', '1.5Fin', '1.5Unf', '2Story', '2.5Fin', '2.5Unf', 'SFoyer' or 'SLvl'" }),

        bedroomAbvGr  : Joi.number().required().messages({ "number.type": "bedrooms must be a number" }).min(1),
        totalbaths      : Joi.number().required().messages({ "number.type": "total baths must be a number" }).min(1).max(7),
        KitchenAbvGr  : Joi.number().required().messages({ "number.type": "Kitchens must be a number" }).min(1),
        kitchenQual   : Joi.string().required().valid('excellent', 'good', 'average', 'fair' , 'poor').lowercase()
        .messages({"any.only": "kitchen quality must be excellent, good, average, fair or poor" }),
        totRmsAbvGrd  : Joi.number().required().messages({ "number.type": "total rooms must be a number" }).min(1),
        centralAir    : Joi.string().required().valid('N','Y')
        .messages({"string.empty": "Central air is required", "any.only": "Central air must be N or Y"}),
        
        salePrice    : Joi.number().required().messages({ "number.type": "Sale price must be a number" }),
        saleCondition: Joi.string().required().valid('normal', 'abnormal', 'adjoining land purchase', 'alloca', 'family', 'partial').lowercase()
        .messages({
            "string.empty": "Sale condition is required",
            "any.only": "Sale condition must be normal, abnormal, adjoining land purchase , family, partial or Alloca"
    }),
        moSold       : Joi.number().required().messages({ "number.type": "Month sold must be a number" }),
        saleType     : Joi.string().valid('conventional', 'cash', 'va Loan', 'new', 'court officer deed/estate', 'contract 15% Down payment regular terms', 'Contract Low Down payment and low intere', 'Contract Low Interest', 'Contract Low Down', 'Other').lowercase().required().messages({ "string.empty": "Sale type is required","any.only": "Sale type must be Conventional, Cash, VA Loan, New, Court Officer Deed/Estate, Contract 15% Down payment regular terms, Contract Low Down payment and low intere, Contract Low Interest, Contract Low Down or Other" }),
    }).unknown();

    let { error, value } = residenceSchema.validate(residence);
    if (error) error = errorUpdate(error);
    return { value, error };
};


exports.completeResidenceValidation = function (residence) {
    const residenceSchema = Joi.object({
        street    : Joi.string().required().valid('gravel', 'paved').lowercase().messages({ "string.empty": "Street is required" , "any.only": "Street must be gravel or paved" }),      
        foundation: Joi.string().required().valid('slab', 'stone', 'wood', 'cinder block', 'brick and tile', 'poured contrete').lowercase().messages({
            "string.empty": "Foundation is required",
            "any.only": "Foundation must be slab, stone, wood, cinder block, brick and tile or poured contrete"
        }),
        bldgType: Joi.string().required().valid('single family', 'duplex', 'townhouse end unit', 'townhouse inside unit', '2 family conversion').lowercase().messages({
            "string.empty": "Building type is required",
            "any.only": "Building type must be single family, duplex, townhouse end unit, townhouse inside unit or 2 family conversion"
        }),
        heating    : Joi.string().required().valid('floor','gas', 'gas water', 'gravity', 'other water', 'wall').lowercase().messages({ 
            "string.empty": "Heating is required",
            "any.only": "Heating must be floor, gas, gas water, gravity, other water or wall" }),
        heatingQc : Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase().messages({
            "string.empty": "Heating quality is required",
            "any.only": "Heating quality must be excellent, good, average, fair or poor"
        }),   
        electrical: Joi.string().required().valid('standard circuit breakers & romex', 'average', 'poor', 'fair' ,'mixed').lowercase().messages({ 
            "string.empty": "Electrical is required",
            "any.only": "Electrical must be  average, poor, fair , mixed or standard circuit breakers & romex" }),
        utilities: Joi.string().required().valid('all', 'electricity only', 'electricity and gas only', 'electricity, gas and water').lowercase().messages({ 
            "string.empty": "Utilities is required",
            "any.only": "Utilities must be all, electricity only, electricity and gas only or electricity, gas and water" }),
        
        lotShape    : Joi.string().required().valid('regular', 'slightly', 'moderately', 'irregular').lowercase()
        .messages({ "string.empty": "Lot shape is required", "any.only": "Lot shape must be regular, slightly, moderately or irregular" }),
        lotConfig   : Joi.string().required().valid('inside', 'corner', 'cul de sac', 'frontage on 2', 'frontage on 3').lowercase()
        .messages({ "string.empty": "Lot configuration is required", "any.only": "Lot configuration must be inside, corner, cul de sac, frontage on 2 or frontage on 3" }),
        landContour : Joi.string().required().valid('level', 'banked', 'hillside', 'depression').lowercase()
        .messages({ "string.empty": "Land contour is required", "any.only": "Land contour must be level, banked, hillside or depression"}),
        landSlope   : Joi.string().required().valid('gentle', 'moderate', 'severe').lowercase()
        .messages({ "string.empty": "Land slope is required", "any.only": "Land slope must be gentle, moderate or severe" }),
       
        condition1  : Joi.string().required().valid('normal', 'feeder', 'arterial',  "east west" , 'north south', 'within 200 of east west', 'within 200 of north-South', 'positive off site feature','near positive' ).lowercase()
        .messages({ "string.empty": "Condition 1 is required", "any.only": "Condition 1 must be normal, feeder, arterial, east west, north south, within 200 of east west, within 200 of North-South, positive off site feature or near positive" }),
        condition2  : Joi.string().required().valid('normal', 'feeder', 'arterial',  "east west" , 'north south', 'within 200 of east west', 'within 200 of North-South', 'positive off site feature','near positive' ).lowercase()
        .messages({ "string.empty": "Condition 2 is required", "any.only": "Condition 2 must be normal, feeder, arterial, east west, north south, within 200 of east west, within 200 of North-South, positive off site feature or near positive" }),
    
        pavedDrive : Joi.string().required().valid('paved', 'dirt/gravel', 'partial')
        .messages({ "string.empty": "Paved drive is required", "any.only": "Paved drive must be paved, dirt/gravel or partial" }),

        exterior1st: Joi.string().required().valid('asbestos shingles', 'asphalt shingles', 'brick face', 'brick common', 'cement board', 'hardboard', 'hardboard siding', 'metal siding' , 'plywood', 'Other', 'precast concrete', 'stucco','vinyl siding', 'wood siding', 'wood shingles','cinder block').lowercase()
        .messages({ "string.empty": "Exterior 1st is required", "any.only": "Exterior 2nd must be asbestos shingles, asphalt shingles, brick face, brick common, cement board, hardboard, hardboard siding, metal siding, plywood, Other, precast concrete, stucco, vinyl siding, wood siding, wood shingles or cinder block"}),  
        exterior2nd: Joi.string().required().valid('asbestos shingles', 'asphalt shingles', 'brick face', 'brick common', 'cement board', 'hardboard', 'hardboard siding', 'metal siding' , 'plywood', 'Other', 'precast concrete', 'stucco','vinyl siding', 'wood siding', 'wood shingles','cinder block').lowercase()
        .messages({ "string.empty": "Exterior 2nd is required", "any.only": "Exterior 2nd must be asbestos shingles, asphalt shingles, brick face, brick common, cement board, hardboard, hardboard siding, metal siding, plywood, Other, precast concrete, stucco, vinyl siding, wood siding, wood shingles or cinder block"}),  
        exterCond   : Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase().messages({
            "string.empty": "Exterior condition is required",
            "any.only": "Exterior condition must be excellent, good, average, fair or poor"
        }),
        exterQual   : Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase().messages({
            "string.empty": "Exterior quality is required",
            "any.only": "Exterior quality must be excellent, good, average, fair or poor"}),

        }).unknown();

    let { error, value } = residenceSchema.validate(residence);
    if (error) error = errorUpdate(error);
    return { value, error };  
};

exports.finalStepValidation = function (residence) {
    const residenceSchema = Joi.object({
        overallQual     : Joi.number().required().messages({ "number.type": "overall material quality must be a number" }).min(1).max(10),
        overallCond     : Joi.number().required().messages({ "number.type": "overall condition must be a number" }).min(1).max(10),

        msSubClass      : Joi.number().required().messages({ "number.type": "msSubClass must be a number" }).min(20).max(190),
        lotFrontage     : Joi.number().required().messages({ "number.type": "lot frontage must be a number" }),
        lotArea         : Joi.number().required().messages({ "number.type": "lot area must be a number" }),
        
        totalsf         : Joi.number().required().messages({ "number.type": "total square footage must be a number" }),
        totalarea       : Joi.number().required().messages({ "number.type": "total area must be a number" }),
        totalporchsf    : Joi.number().required().messages({ "number.type": "total porch square footage must be a number" }),
        
        masVnrArea      : Joi.number().required().messages({ "number.type": "masonry veneer area must be a number" }),
        masVnrType: Joi.string().valid('brick face', 'brick common', 'cinder block', 'None', 'Stone').lowercase().messages({
            "string.empty": "Masonry veneer type is required",
            "any.only": "Masonry veneer type must be brick face, brick common, cinder block, Stone or None "
        }),

        houseage        : Joi.number().required().messages({ "number.type": "house age must be a number" }),
        houseremodelage : Joi.number().required().messages({ "number.type": "house remodel age must be a number" }),

        miscVal         : Joi.number().messages({ "number.type": "miscellaneous value must be a number" }),
        lowQualFinSF    : Joi.number().messages({ "number.type": "low quality finished square footage must be a number" }),
    }).unknown();

    let { error, value } = residenceSchema.validate(residence);
    if (error) error = errorUpdate(error);
    return { value, error };
}

exports.updateResidenceValidation = function (residence) {
    const residenceSchema = Joi.object({
        title        : Joi.string().messages({ "string.empty": "Title is required" }),
        type         : Joi.string().valid("rent", "sale").trim().lowercase().messages({"string.empty": "Type is required","any.only": "Type must be rent or sale" }),
        category     : Joi.string().valid("apartment", "house", "hotel", "villa",  "cottage").lowercase().trim().messages({"string.empty": "Category is required","any.only": "Category must be apartment, house, hotel, villa or cottage" }),
        neighborhood : Joi.string().valid('bloomington heights',  'blueste', 'briardale', 'brookside', 'clear creek', 'college creek', 'crawford', 'edwards','gilbert',  'iowa dot and rail road', 'meadow village').lowercase().messages({"any.only": "Neighborhood must be bloomington heights, blueste, briardale, brookside, clear creek, college creek, crawford, edwards, gilbert, iowa dot and rail road, meadow village" }),
        mszoning     : Joi.string().valid('agricultural', 'commercial', 'floating village', 'industrial', 'high residential','low', 'park', 'medium' ).lowercase().messages({ "string.empty": "zoning is required", "any.only": "zoning must be agricultural, commercial, industrial , high residential, low,medium or park "}),
        hasGarage    : Joi.boolean(),
        garageFinish: Joi.any().when('hasGarage',{ 
            is:true,
            then: Joi.string().required().valid('finished','rough finished' ,'unfinished', 'not available').lowercase().messages({
                "string.empty": "Garage finish is required",
                "any.only": "Garage finish must be finished, rough finished, unfinished or not available"}),
        }), 
        garageCars  : Joi.any().when('hasGarage', {
            is:true,
            then: Joi.number().required().messages({ "number.type": "Garage cars must be a number" })
        }),
        garageType  : Joi.any().when('hasGarage', {
            is:true,
            then: Joi.string().required().valid('2 types', 'attached', 'basement', 'built in', 'car port', 'detached', 'not available').lowercase()
        .messages({ "any.only": "Garage type must be 2 types, attached, basement, built in, car port, detached or not available" })
        }),
        garageQual  : Joi.any().when('hasGarage',{
            is:true,
            then: Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor', 'not available').lowercase()
        .messages({"any.only": "Garage quality must be excellent, good, average, fair, poor or not available" })
        }),
        
        hasBasement : Joi.boolean().messages({ "boolean.empty": "isBasement attribute is required" }),
        bsmtExposure: Joi.any().when('hasBasement', {
            is:true,
            then: Joi.string().required().valid('good', 'average', 'min', 'no exposure').lowercase()
        .messages({"any.only": "Basement exposure must be good, average, min or no exposure" })
        }),
        bsmtFinType1: Joi.any().when('hasBasement', { 
            is:true, 
            then: Joi.string().required().valid('good', 'average', 'below average', 'average rec room',  'low', 'unfinished' ).lowercase()
        .messages({"any.only": "Basement finish type must be good, average, below average, average rec room, low or unfinished " })
        }),
        bsmtQual    : Joi.any().when('hasBasement', { 
            is:true, 
            then: Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase()
        .messages({"any.only": "Basement quality must be excellent, good, average, fair or poor" }) 
    }),
        bsmtCond    : Joi.any().when('hasBasement', { 
            is:true, 
            then: Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor', 'not available').lowercase()
        .messages({"any.only": "Basement condition must be excellent, good, average, fair or poor" }) 
    }),
        bsmtUnfSF   : Joi.any().when('hasBasement', { is:true, then: Joi.number().required().messages({ "number.type": "Basement unfinished square footage must be a number" })}),
        hasFireplace : Joi.boolean().messages({ "boolean.empty": "isFireplace attribute is required" }),
        fireplaces   : Joi.any().when('hasFireplace', { is:true, then: Joi.number().required().messages({ "number.type": "fireplaces must be a number"  })}),
        fireplaceQu  : Joi.any().when('hasFireplace', { is:true, then: Joi.string().required().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase().messages({"any.only": "fireplaceQu must be excellent, good, average, fair or poor"})}),
        poolArea: Joi.number().messages({ "number.type": "poolArea must be a number" }),
        roofStyle: Joi.string().valid('Flat', 'Gable', 'Gambrel', 'Hip', 'Mansard', 'Shed').messages({ 
            "string.empty": "Roof style is required",
            "any.only":  "Roof style must be Flat, Gable, Gambrel, Hip, Mansard or Shed" }),
        roofMatl      : Joi.string().valid('clay or tile', 'standard shingle', 'membran', 'metal', 'roll', 'gravel & tar', 'wood shakes', 'wood shingles').lowercase() 
        .messages({ "any.only":  "Roof material must be 'clay or tile', standard shingle, membran, metal, roll, 'gravel & tar', wood shakes, wood shingles" }), 
        houseStyle    :Joi.string().valid('1Story', '1.5Fin', '1.5Unf', '2Story', '2.5Fin', '2.5Unf', 'SFoyer', 'SLvl')
        .messages({"any.only":"House style must be'1Story', '1.5Fin', '1.5Unf', '2Story', '2.5Fin', '2.5Unf', 'SFoyer' or 'SLvl'" }),

        bedroomAbvGr  : Joi.number().messages({ "number.type": "bedrooms must be a number" }).min(1),
        KitchenAbvGr  : Joi.number().messages({ "number.type": "Kitchens must be a number" }).min(1),
        kitchenQual   : Joi.string().valid('excellent', 'good', 'average', 'fair' , 'poor').lowercase().messages({"any.only": "kitchen quality must be excellent, good, average, fair or poor" }),
        totRmsAbvGrd  : Joi.number().messages({ "number.type": "total rooms must be a number" }).min(1),
        centralAir    : Joi.string().valid('N','Y').messages({"string.empty": "Central air is required", "any.only": "Central air must be N or Y"}),
        salePrice     : Joi.number().messages({ "number.type": "Sale price must be a number" }),
        saleCondition : Joi.string().valid('normal', 'abnormal', 'adjoining land purchase', 'alloca', 'family', 'partial').lowercase().messages({"any.only": "Sale condition must be normal, abnormal, adjoining land purchase , family, partial or Alloca"}),
        moSold        : Joi.number().messages({ "number.type": "Month sold must be a number" }),
        saleType      : Joi.string().valid('conventional', 'cash', 'va Loan', 'new', 'court officer deed/estate', 'contract 15% Down payment regular terms', 'Contract Low Down payment and low intere', 'Contract Low Interest', 'Contract Low Down', 'Other').lowercase()
        .messages({ "string.empty": "Sale type is required","any.only": "Sale type must be Conventional, Cash, VA Loan, New, Court Officer Deed/Estate, Contract 15% Down payment regular terms, Contract Low Down payment and low intere, Contract Low Interest, Contract Low Down or Other" }),
        street        : Joi.string().valid('gravel', 'paved').lowercase().messages({ "string.empty": "Street is required" , "any.only": "Street must be gravel or paved" }),      
        foundation   : Joi.string().valid('slab', 'stone', 'wood', 'cinder block', 'brick and tile', 'poured contrete').lowercase().messages({
            "any.only": "Foundation must be slab, stone, wood, cinder block, brick and tile or poured contrete"
        }),
        bldgType: Joi.string().valid('single family', 'duplex', 'townhouse end unit', 'townhouse inside unit', '2 family conversion').lowercase().messages({
            "any.only": "Building type must be single family, duplex, townhouse end unit, townhouse inside unit or 2 family conversion"
        }),
        heating    : Joi.string().valid('floor','gas', 'gas water', 'gravity', 'other water', 'wall').lowercase().messages({ 
            "any.only": "Heating must be floor, gas, gas water, gravity, other water or wall" }),
        heatingQc : Joi.string().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase().messages({
            "any.only": "Heating quality must be excellent, good, average, fair or poor"
        }),   
        electrical: Joi.string().valid('standard circuit breakers & romex', 'average', 'poor', 'fair' ,'mixed').lowercase().messages({ 
            "any.only": "Electrical must be  average, poor, fair , mixed or standard circuit breakers & romex" }),
        utilities: Joi.string().valid('all', 'electricity only', 'electricity and gas only', 'electricity, gas and water').lowercase().messages({ 
            "any.only": "Utilities must be all, electricity only, electricity and gas only or electricity, gas and water" }),
        
        lotShape    : Joi.string().valid('regular', 'slightly', 'moderately', 'irregular').lowercase()
        .messages({ "string.empty": "Lot shape is required", "any.only": "Lot shape must be regular, slightly, moderately or irregular" }),
        lotConfig   : Joi.string().valid('inside', 'corner', 'cul de sac', 'frontage on 2', 'frontage on 3').lowercase()
        .messages({ "any.only": "Lot configuration must be inside, corner, cul de sac, frontage on 2 or frontage on 3" }),
        landContour : Joi.string().valid('level', 'banked', 'hillside', 'depression').lowercase()
        .messages({ "any.only": "Land contour must be level, banked, hillside or depression"}),
        landSlope   : Joi.string().valid('gentle', 'moderate', 'severe').lowercase()
        .messages({  "any.only": "Land slope must be gentle, moderate or severe" }),
        condition1  : Joi.string().valid('normal', 'feeder', 'arterial',  "east west" , 'north south', 'within 200 of east west', 'within 200 of north-South', 'positive off site feature','near positive' ).lowercase()
        .messages({ "any.only": "Condition 1 must be normal, feeder, arterial, east west, north south, within 200 of east west, within 200 of North-South, positive off site feature or near positive" }),
        condition2  : Joi.string().valid('normal', 'feeder', 'arterial',  "east west" , 'north south', 'within 200 of east west', 'within 200 of North-South', 'positive off site feature','near positive' ).lowercase()
        .messages({"any.only": "Condition 2 must be normal, feeder, arterial, east west, north south, within 200 of east west, within 200 of North-South, positive off site feature or near positive" }),
        
        masVnrType: Joi.string().valid('brick face', 'brick common', 'cinder block', 'None', 'Stone').lowercase().messages({
            "any.only": "Masonry veneer type must be brick face, brick common, cinder block, Stone or None "
        }),
        pavedDrive : Joi.string().valid('paved', 'dirt/gravel', 'partial')
        .messages({"any.only": "Paved drive must be paved, dirt/gravel or partial" }),

        exterior1st: Joi.string().valid('asbestos shingles', 'asphalt shingles', 'brick face', 'brick common', 'cement board', 'hardboard', 'hardboard siding', 'metal siding' , 'plywood', 'Other', 'precast concrete', 'stucco','vinyl siding', 'wood siding', 'wood shingles','cinder block').lowercase()
        .messages({ "any.only": "Exterior 2nd must be asbestos shingles, asphalt shingles, brick face, brick common, cement board, hardboard, hardboard siding, metal siding, plywood, Other, precast concrete, stucco, vinyl siding, wood siding, wood shingles or cinder block"}),  
        exterior2nd: Joi.string().valid('asbestos shingles', 'asphalt shingles', 'brick face', 'brick common', 'cement board', 'hardboard', 'hardboard siding', 'metal siding' , 'plywood', 'Other', 'precast concrete', 'stucco','vinyl siding', 'wood siding', 'wood shingles','cinder block').lowercase()
        .messages({"any.only": "Exterior 2nd must be asbestos shingles, asphalt shingles, brick face, brick common, cement board, hardboard, hardboard siding, metal siding, plywood, Other, precast concrete, stucco, vinyl siding, wood siding, wood shingles or cinder block"}),  
        exterCond       : Joi.string().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase().messages({"any.only": "Exterior condition must be excellent, good, average, fair or poor"}),
        exterQual       : Joi.string().valid('excellent', 'good', 'average', 'fair', 'poor').lowercase().messages({"any.only": "Exterior quality must be excellent, good, average, fair or poor"}),
       
        overallQual     : Joi.number().messages({ "number.type": "overall material quality must be a number" }).min(1).max(10),
        overallCond     : Joi.number().messages({ "number.type": "overall condition must be a number" }).min(1).max(10),
        totalarea       : Joi.number().messages({ "number.type": "total area must be a number" }),
        totalporchsf    : Joi.number().messages({ "number.type": "total porch square footage must be a number", "number.empty": "total porch square footage is required" }).min(1),
        totalbaths      : Joi.number().messages({ "number.type": "total baths must be a number", "number.empty": "total baths is required"}).min(1),
       
        msSubClass      : Joi.number().messages({ "number.type": "msSubClass must be a number" }).min(20).max(190),
        lotFrontage     : Joi.number().messages({ "number.type": "lot frontage must be a number" }),
        lotArea         : Joi.number().messages({ "number.type": "lot area must be a number" }),
        masVnrArea      : Joi.number().messages({ "number.type": "masonry veneer area must be a number" }),
        totalsf         : Joi.number().messages({ "number.type": "total square footage must be a number" }),
        houseage        : Joi.number().messages({ "number.type": "house age must be a number" }),
        houseremodelage : Joi.number().messages({ "number.type": "house remodel age must be a number" }),
        miscVal         : Joi.number().messages({ "number.type": "miscellaneous value must be a number" }),
        lowQualFinSF    : Joi.number().messages({ "number.type": "low quality finished square footage must be a number" }),
        }).unknown();
    
        let { error, value } = residenceSchema.validate(residence);
        if (error) error = errorUpdate(error);
        return { value, error };
};