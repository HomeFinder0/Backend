const { 
    neighborhoodConverter,   mszoningConverter,
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
    foundationConverter,     alleyConverter,
    qualityRatingConverter,
    } = require('../../../Helpers/converter.js');

    
module.exports = (value)=>{
    value.neighborhood = neighborhoodConverter(value.neighborhood);
    value.saleCondition= saleConditionConverter(value.saleCondition);
    value.saleType     = saleTypeConverter(value.saleType);
    value.kitchenQual  = qualityRatingConverter(value.kitchenQual);
    value.mszoning     = mszoningConverter(value.mszoning);
    value.lotShape     = lotShapeConverter(value.lotShape);   
    value.electrical   = electricalConverter(value.electrical);
    value.foundation   = foundationConverter(value.foundation);
    value.bldgType     = bldgTypeConverter(value.bldgType);
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
    value.kitchenQual  = qualityRatingConverter(value.kitchenQual);
    value.lotConfig    = lotConfigConverter(value.lotConfig);
    value.landContour  = landContourConverter(value.landContour);
    value.landSlope    = landSlopeConverter(value.landSlope);
    value.pavedDrive   = pavedDriveConverter(value.pavedDrive);

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
    }
    
    if(value.hasFireplace)  value.fireplaceQu = qualityRatingConverter(value.fireplaceQu);

    return value;
}   

