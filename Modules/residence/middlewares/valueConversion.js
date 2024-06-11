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
    qualityRatingConverter,  utilitiesConverter
    } = require('../../../Helpers/converter.js');

    
module.exports = (value)=>{
    //console.log(typeof value.utilities);

    if(value.utilities){
       // console.log(value.utilities);
   //     if(typeof value.utilities == string) utilitiesConverter(value);
        // else{
            switch(value.utilities.length) {
                case 3:
                    value.utilities = 'AllPub';
                    break;
                case 1:
                    value.utilities = 'ELO'; //electricity is always required
                break;
                default:
                    value.utilities = value.utilities.includes('gas') ? 'NoSeWa' : value.utilities.includes('water') ? 'NoSewr' : value.utilities;
                    break;
    //}
}}
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

    value.garageType   = garageConverter(value.garageType);
    value.garageFinish = garageConverter(value.garageFinish);
    value.garageQual   = qualityRatingConverter(value.garageQual);

    value.bsmtFinType1  = bsmtFinType1Converter(value.bsmtFinType1);
    value.bsmtExposure  = bsmtExposureConverter(value.bsmtExposure);
    value.bsmtCond      = qualityRatingConverter(value.bsmtCond);
    value.bsmtQual      = qualityRatingConverter(value.bsmtQual);
        
    value.fireplaceQu = qualityRatingConverter(value.fireplaceQu);

    return value;
}   

