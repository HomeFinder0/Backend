const mongoose = require('mongoose');

const residenceSchema = new mongoose.Schema({
    ownerId     : { type: mongoose.Schema.Types.ObjectId,  ref: 'Users' },
    reviews     : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],

    title       : { type: String },
    type        : { type: String,  enum: ['rent', 'sale'] },
    category    : { type: String,  enum: ['apartment', 'house', 'hotel', 'villa', 'cottage'],},
    neighborhood:{type: String},//loaction

    images:[{
        url: { type: String },
        public_id: { type: String }
    }],
   
    poolArea   :{ type: Number, default: 0},
    roofStyle  :{ type: String, enum: ['Flat', 'Gable', 'Gambrel', 'Hip', 'Mansard', 'Shed'] },
    roofMatl   :{ type: String, enum: ['ClyTile', 'CompShg', 'Membran', 'Metal', 'Roll', 'Tar&Grv', 'WdShake', 'WdShngl'] },
    houseStyle :{ type: String, enum: ['1Story', '1.5Fin', '1.5Unf', '2Story', '2.5Fin', '2.5Unf', 'SFoyer', 'SLvl']},
    
    hasGarage   :{ type: Boolean, default: false},
    garageCars  :{ type: Number, default: 0},
    garageFinish:{ type: String, default: 'NA' }, 
    garageType  :{ type: String, default: 'NA'},  
    garageQual  :{ type: String, default: 'NA'},

    hasFireplace  :{ type: Boolean, default: false},
    fireplaces   :{ type: Number , default:0},
    fireplaceQu  :{ type: String, default: 'NA' }, 
    
    hasBasement  :{type: Boolean, default: false},
    bsmtExposure :{type: String,  enum: ['Gd','Av','Mn','No'], default: "No"},
    bsmtFinType1 :{type: String,  enum: ['GLQ','ALQ','BLQ','Rec','LwQ','Unf']}, 
    smtCond      :{type: String,  enum: ['Ex', 'Gd', 'TA', 'Fa', 'Po', 'NO'], default: "NO"},
    bsmtQual     :{type:String,   enum: ['Ex', 'Gd', 'TA', 'Fa', 'Po', 'NO'], default: "NO"},
    bsmtUnfSF    :{type: Number,  default: 0},

    bedroomAbvGr :{ type: Number },
    totRmsAbvGrd :{ type: Number }, //total rooms without bathrooms
    KitchenAbvGr :{ type: Number },
    kitchenQual  :{ type: String }, 
    
    street     :{ type: String, enum: ['Pave', 'Grvl']},
    foundation :{ type: String, enum:['BrkTil','CBlock','PConc','Slab', 'Stone', 'Wood']},
    bldgType   :{ type: String, enum: ['1Fam', '2fmCon', 'Duplex', 'TwnhsE', 'TwnhsI'] }, //Type of dwelling
    
    centralAir :{ type: String, enum:['N','Y']},
    heating    :{ type: String, enum:['Floor','GasA','GasW','Grav','OthW','Wall'] },
    heatingQc  :{type: String,  enum:['Ex','Gd','TA','Fa','Po']},   
    electrical :{ type: String, enum:['SBrkr','FuseA','FuseF','FuseP','Mix']  },
    
    saleCondition:{ type: String,  enum: ['Normal', 'Abnorml', 'AdjLand', 'Alloca', 'Family', 'Partial']  },
    saleType     :{ type: String,  enum:['WD','CWD','VWD','New','COD','Con','ConLw','ConLI','ConLD','Oth']},
    moSold       :{ type: Number },
    SalePrice    :{ type: Number },
    mszoning     :{ type: String},
    
    utilities  :{ type: String,   enum: ['AllPub', 'NoSewr', 'NoSeWa', 'ELO']},
    lotShape   :{ type: String,   enum: ['Reg', 'IR1', 'IR2', 'IR3']},
    lotConfig  :{ type: String,   enum: ['Inside', 'Corner', 'CulDSac', 'FR2', 'FR3']},
    landContour:{ type: String,   enum: ['Lvl', 'Bnk', 'HLS', 'Low']},
    landSlope  :{ type: String,   enum: ['Gtl', 'Mod', 'Sev']},
    condition1 :{ type: String,   enum: ['Artery', 'Feedr', 'Norm', 'RRNn', 'RRAn', 'PosN', 'PosA', 'RRNe', 'RRAe']},
    condition2 :{ type: String,   enum: ['Artery', 'Feedr', 'Norm', 'RRNn', 'RRAn', 'PosN', 'PosA', 'RRNe', 'RRAe']},
    masVnrType :{ type: String,   enum: ['BrkCmn', 'BrkFace', 'CBlock', 'None', 'Stone'], default: "None"}, 
    pavedDrive :{ type: String,   enum: ['Y','P','N'] }, 
    exterCond  :{ type: String,   enum: ['Ex', 'Gd', 'TA', 'Fa', 'Po']},
    exterQual  :{ type: String,   enum: ['Ex','Gd','TA','Fa','Po']},
    exterior1st:{ type: String},
    exterior2nd:{ type: String,   enum: ['AsbShng', 'AsphShn', 'BrkComm', 'BrkFace', 'CBlock', 'CemntBd', 'HdBoard', 'ImStucc', 'MetalSd', 'Other', 'Plywood', 'PreCast', 'Stone', 'Stucco', 'VinylSd', 'Wd Sdng', 'WdShing']}, 
    

    overallQual    :{ type: Number}, 
    overallCond    :{ type: Number},
    msSubClass     :{ type: Number, default: 0 }, 
    totalporchsf   :{ type: Number, default: 0 },
    lotFrontage    :{ type: Number, default: 0},
    lotArea        :{ type: Number, default: 0},
    masVnrArea     :{ type: Number, default: 0},
    lowQualFinSF   :{ type: Number, default: 0},
    miscVal        :{ type: Number, default: 0},
    
    totalsf        : { type: Number, default: 0 },
    totalarea      :{ type: Number, default: 0 },
    totalbaths     :{ type: Number, default: 0 },
    houseage       :{ type: Number, default: 0},
    houseremodelage:{ type: Number, default: 0},
},{
        timestamp: true
    }
);


module.exports = mongoose.model('Residence', residenceSchema);