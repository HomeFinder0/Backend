const mongoose = require('mongoose');

const residenceSchema = new mongoose.Schema({
    ownerId     : { type: mongoose.Schema.Types.ObjectId,  ref: 'Users' },
    Id          : { type: Number, unique: true},
    isSold      : { type: Boolean, default: false },
    isCompleted : { type: Boolean, default: false },
    status      : {type : String, default: "pending", enum :["pending", "approved", "rejected"]},
    avgRating   : { type: Number, default: 0 },
    title       : { type: String },
    type        : { type: String,  enum: ['rent', 'sale'] },
    category    : { type: String,  enum: ['apartment', 'house', 'hotel', 'villa', 'cottage'],},
    paymentPeriod:{ type: String,  enum:['monthly', 'yearly'] },
    
    hasGarage     :{ type: Boolean, default: false},
    hasFireplace  :{ type: Boolean, default: false},
    hasBasement   :{ type: Boolean, default: false},

    images:[{
        url: { type: String},
        public_id: { type: String}
    }],
    reviews   : [{type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    likedUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'  }],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates : {
          type: [Number],
          default: [ -93.63323867085344, 42.03320661739305] //[long, lat]
      },
      city: {
            type: String, defualt: 'Ames'
          },
      state: {
            type: String, defualt: 'Iowa'
            },
      country: {
            type: String, defualt: 'United States'
          },
      fullAddress: {
            type: String, defualt: 'Ames, Iowa, United States'
          },
    },  

    // ML Model Features
    neighborhood: { type: String},
    alley      : {type:String, default:'NA', enum:['Grvl','Pave', 'NA']}, 
    poolArea   :{ type: Number, default: 0},
    roofStyle  :{ type: String, enum: ['Flat', 'Gable', 'Gambrel', 'Hip', 'Mansard', 'Shed'] },
    roofMatl   :{ type: String, enum: ['ClyTile', 'CompShg', 'Membran', 'Metal', 'Roll', 'Tar&Grv', 'WdShake', 'WdShngl'] },
    houseStyle :{ type: String, enum: ['1Story', '1.5Fin', '1.5Unf', '2Story', '2.5Fin', '2.5Unf', 'SFoyer', 'SLvl']},
    
    garageCars  :{ type: Number, default: 0},
    garageFinish:{ type: String, default: 'No' }, 
    garageType  :{ type: String, default: 'No'},  
    garageQual  :{ type: String, default: 'No'},

    fireplaces   :{ type: Number , default:0},
    fireplaceQu  :{ type: String, default: 'No' }, 
    
    bsmtExposure :{type: String,  enum: ['Gd','Av','Mn','No'], default: "No"},
    bsmtFinType1 :{type: String,  enum: ['GLQ','ALQ','BLQ','Rec','LwQ','Unf'], default: "Unf"}, 
    bsmtCond      :{type: String,  enum: ['Ex', 'Gd', 'TA', 'Fa', 'Po', 'No'], default: "No"},
    bsmtQual     :{type:String,   enum: ['Ex', 'Gd', 'TA', 'Fa', 'Po', 'No'], default: "No"},
    bsmtUnfSF    :{type: Number,  default: 0},

    bedroomAbvGr :{ type: Number },
    totRmsAbvGrd :{ type: Number }, //total rooms without bathrooms
    KitchenAbvGr :{ type: Number },
    kitchenQual  :{ type: String }, 
    
    street     :{ type: String, enum: ['Pave', 'Grvl']},
    foundation :{ type: String, enum:['BrkTil','CBlock','PConc','Slab', 'Stone', 'Wood']},
    bldgType   :{ type: String, enum: ['1Fam', '2fmCon', 'Duplx', 'TwnhsE', 'TwnhsI'] }, //Type of dwelling
    
    centralAir :{ type: String, enum:['N','Y']},
    heating    :{ type: String, enum:['Floor','GasA','GasW','Grav','OthW','Wall'] },
    heatingQc  :{type: String,  enum:['Ex','Gd','TA','Fa','Po']},   
    electrical :{ type: String, enum:['SBrkr','FuseA','FuseF','FuseP','Mix']  },
    
    saleCondition:{ type: String,  enum: ['Normal', 'Abnorml', 'AdjLand', 'Alloca', 'Family', 'Partial']  },
    saleType     :{ type: String,  enum:['WD','CWD','VWD','New','COD','Con','ConLw','ConLI','ConLD','Oth']},
    moSold       :{ type: Number },
    salePrice    :{ type: Number },
    mszoning     :{ type: String, enum:["A", "C", 'FV', 'I', 'RH','RL', 'RP', 'RM']},
    
    utilities  :{ type: String,   enum: ['AllPub', 'NoSewr', 'NoSeWa', 'ELO']},
    lotShape   :{ type: String,   enum: ['Reg', 'IR1', 'IR2', 'IR3']},
    lotConfig  :{ type: String,   enum: ['Inside', 'Corner', 'CulDSac', 'FR2', 'FR3']},
    landContour:{ type: String,   enum: ['Lvl', 'Bnk', 'HLS', 'Low']},
    landSlope  :{ type: String,   enum: ['Gtl', 'Mod', 'Sev']},
    condition1 :{ type: String,   enum: ['Artery', 'Feedr', 'Norm', 'RRNn', 'RRAn', 'PosN', 'PosA', 'RRNe', 'RRAe']},
    condition2 :{ type: String,   enum: ['Artery', 'Feedr', 'Norm', 'RRNn', 'RRAn', 'PosN', 'PosA', 'RRNe', 'RRAe']},
    pavedDrive :{ type: String,   enum: ['Y','P','N'] }, 
    exterCond  :{ type: String,   enum: ['Ex', 'Gd', 'TA', 'Fa', 'Po']},
    exterQual  :{ type: String,   enum: ['Ex','Gd','TA','Fa','Po']},
    exterior1st:{ type: String},
    exterior2nd:{ type: String,   enum: ['AsbShng', 'AsphShn', 'BrkComm', 'BrkFace', 'CBlock', 'CmentBd', 'HdBoard', 'ImStucc', 'MetalSd', 'Other', 'Plywood', 'PreCast', 'Stone', 'Stucco', 'VinylSd', 'Wd Sdng', 'Wd Shng']}, 
    
    masVnrType :{ type: String,   enum: ['BrkCmn', 'BrkFace', 'CBlock', 'No', 'Stone'], default: "No"}, 
    masVnrArea     :{ type: Number, default: 0},
    
    overallQual    :{ type: Number}, 
    overallCond    :{ type: Number},
    msSubClass     :{ type: Number, default: 0 }, 
    totalporchsf   :{ type: Number, default: 0 },
    lotFrontage    :{ type: Number, default: 0},
    lotArea        :{ type: Number, default: 0},
    lowQualFinSF   :{ type: Number, default: 0},
    miscVal        :{ type: Number, default: 0},
    
    totalsf        : { type: Number, default: 0 },
    totalarea      :{ type: Number, default: 0 },
    totalbaths     :{ type: Number, default: 0 },

    houseage       :{ type: Number, default: 0},
    houseremodelage:{ type: Number, default: 0},
    Functional     :{ type: String, default: 'Typ'},
    kitchenAbvGr   :{ type: Number, default: 0},
},
{
  timestamps: true,
  toJSON: { 
      transform: function (doc, ret, options) {
        const userId     = options.userId ? options.userId.toString() : null; // current user id to check if the user liked the residence or not
        const likedUsers = ret.likedUsers ? ret.likedUsers.map(id => id.toString()) : [];
        const isLiked    = userId ? likedUsers.includes(userId) : false;
      
        delete ret.__v;
        delete ret.Functional;
        delete ret.kitchenAbvGr;
        return {
          isLiked,
          ...ret,
          }
      }
  }
}
);
residenceSchema.methods.mlFeatures = function(){
  const residence = this;
  const residenceObject = residence.toObject();

  delete residenceObject.ownerId;
  delete residenceObject.title;
  delete residenceObject.category;
  delete residenceObject.type;
  delete residenceObject.location;
  delete residenceObject.status;
  delete residenceObject.isCompleted;
  delete residenceObject.isSold;
  delete residenceObject.paymentPeriod;
  delete residenceObject.hasGarage;
  delete residenceObject.hasFireplace;
  delete residenceObject.hasBasement;
  delete residenceObject.avgRating;
  delete residenceObject.images;
  delete residenceObject.reviews;
  delete residenceObject.likedUsers;
  delete residenceObject.createdAt;
  delete residenceObject.updatedAt;
  delete residenceObject.__v;
  delete residenceObject.KitchenAbvGr;
  
  return residenceObject;
}

residenceSchema. index({"images._id": 1});
residenceSchema.index({ 'location': '2dsphere' }); // calculate geometries on an earth-like sphere.

module.exports = mongoose.model('Residence', residenceSchema);
