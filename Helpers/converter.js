exports.msSubClassConverter = (value) => {
    const conversions = {
        "1story and newer" : 20,
        "1story and older" : 30,
        "2story and newer" : 60,
        "2story and older" : 70,
        "1 story finished attic" : 40,
        "1 story unfinished attic" : 45,
        "multi-level" : 80,
        "split foyer" : 85,
        "duplex" : 90,
        "multilevel and split" : 180,
        "2 family conversion" : 190,
    };

    return conversions[value];
};

exports.bldgTypeConverter = (value) => {
    const conversions = {
        'single-family' : '1Fam',
        'two-family': '2fmCon',
        'duplex': 'Duplx',
        'townhouse end unit': 'TwnhsE',
        'townhouse inside unit': 'TwnhsI'
    };

    return conversions[value];
};

exports.qualityRatingConverter = (value) => {
    const conversions = {
        'good'         : 'Gd',
        'fair'         : 'Fa',
        'poor'         : 'Po',
        'average'      : 'TA',
        'excellent'    : 'Ex',
        'not available': 'NA'
    };

    return conversions[value];
}
exports.centralAirConverter = (value) => {
    const conversions = {
        'yes' : 'Y',
        'no'  : 'N'
    };

    return conversions[value];
};

exports.neighborhoodConverter = (value) => {
    const conversions = {
        'bloomington heights'   : 'Blmngtn',
        'bluestem'               : 'Blueste',
        'briardale'             : 'BrDale',
        'clear creek'           : 'ClearCr',
        'college creek'         : 'CollgCr',
        'crawfor'                : 'Crawfor',
        'edwards'               : 'Edwards',
        'gilbert'               : 'Gilbert',
        'iowa dot and rail road': 'IDOTRR',
        'meadow village'        : 'MeadowV',
        'mitchell'              : "Mitchel",
        'north ames'            : 'Names',
        'northridge'            : 'NoRidge',
        'northpark villa'       : 'NPkVill',
        'northridge heights'    : 'NridgHt',
        'northwest ames'        : 'NWAmes',
        'old town'              : 'OldTown',
        'sawyer'                : 'Sawyer',
        'sawyer west'           : 'SawyerW',
        'somerset'              : 'Somerst',
        'stone brook'           : 'StoneBr',
        'timberland'            : 'Timber',
        'veenker'               : 'Veenker',
        'south & west of iowa state university': 'SWISU',
    };

    return conversions[value];
};



exports.mszoningConverter = (value) => {
    const conversions = {
        'agricultural'   : 'A',
        'commercial'     : 'C',
        'floating village': 'FV',
        'industrial'      : 'I',
        'high residential': 'RH',
        'low' : 'RL',
        'park'        : 'RP',
        'medium': 'RM'
    };

    return conversions[value];
};

exports.roofMaterialsConverter = (value) => {
    const conversions = {
        'roll'             : 'Roll',
        'metal'            : 'Metal',
        'membran'          : 'Membran',
        'wood shakes'      : 'WdShake',
        'gravel & tar'     : 'Tar&Grv',
        'clay or tile'     : 'ClyTile',
        'wood shingles'    : 'WdShngl',
        'standard shingle' : 'CompShg',
    }
    return conversions[value];
};

exports.garageConverter = (value) => {
    const conversions = {
        'finished'      : 'Fin',
        'rough finished': 'RFn',
        'unfinished'    : 'Unf',
        'not available' : 'NA',

        'built in'          : 'BuiltIn',
        'Car Port'          : 'CarPort',
        'more than one'     : '2Types',
        'basement Garage'   : 'Basment',
        'attached to home'  : 'Attchd',
        'Detached from home': 'Detchd' 
    }
    return conversions[value];
}

exports.saleConditionConverter = (value) => {
    const conversions = {
        'normal'                 : 'Normal',
        'abnormal'               : 'Abnorml',
        'adjoining land purchase': 'AdjLand',
        'allocation'             : 'Alloca',
        'family'                 : 'Family',
        'partial'                : 'Partial'

    }
    return conversions[value];
}

exports.saleTypeConverter = (value) => {
    const conversions = {
        'other'                                    : 'Oth',
        'conventional'                             : 'WD',
        'cash'                                     : 'CWD',
        'va loan'                                  : 'VWD',
        'new'                                      : 'New',
        'court officer deed/estate'                : 'COD',
        'contract low interest'                    : 'ConLI',
        'contract low down'                        : 'ConLD',
        'contract 15% down payment regular terms'  : 'Con',
        'contract low down payment and low intere' : 'ConLw',
    }
    return conversions[value];
}
exports.alleyConverter = (value) =>{
    const conversions = {
        'gravel' : 'Grvl',
        'paved'  : 'Pave',
        'no alley access':'NA' 	
    };

    return conversions[value];
}
exports.streetConverter = (value) => {
    const conversions = {
        'gravel' : 'Grvl',
        'paved'  : 'Pave'
    }
    return conversions[value];
}

exports.electricalConverter = (value) => {
    const conversions = {
        'standard circuit breakers & romex' : 'SBrkr',
        'Average' : 'FuseA',
        'Fair' : 'FuseF',
        'poor' : 'FuseP',
        'mixed'   : 'Mix'
    }
    return conversions[value];
}

exports.heatingConverter = (value) => {
    const conversions = {
        'floor'      : 'Floor',
        'gas'        : 'GasA',
        'gas water'  : 'GasW',
        'gravity'    : 'Grav',
        'other water': 'OthW',
        'wall'       : 'Wall'
    }
    return conversions[value];
}


exports.lotShapeConverter = (value) => {
    const conversions = {
        'regular'   : 'Reg',
        'slightly' : 'IR1',
        'moderately' : 'IR2',
        'irregular' : 'IR3'
    }
    return conversions[value];
}

exports.landContourConverter = (value) => {
    const conversions = {
        'level'   : 'Lvl',
        'banked'  : 'Bnk',
        'hillside': 'HLS',
        'depression': 'Low'
    }
    return conversions[value];
}

exports.utilitiesConverter = (value) => {
    const conversions = {
        'all'                         : 'AllPub',
        'electricity only'            : 'ELO',
        'electricity and gas only'    : 'NoSeWa',
        'electricity, gas and water'  : 'NoSewr',
    }
    return conversions[value];
};

exports.lotConfigConverter = (value) => {
    const conversions = {
        'inside'        : "Inside",
        'corner'        : "Corner",
        'cul de sac'    : "CulDSac",
        'frontage on 2' : 'FR2',
        'frontage on 3' : 'FR3',
    };

    return conversions[value];
};

exports.landSlopeConverter = (value) => {
    const conversions = {
        'gentle' : 'Gtl',
        'moderate': 'Mod',
        'severe' : 'Sev'
    };
    return conversions[value];
};

exports.condConverter = (value) =>{
    const conversions = {
        'normal'                    :'Norm',
        'feeder'                    :'Feedr',
        'arterial'                  :'Artery',
        "east west"                 :'RRAe',
        "north south"               :'RRAn',
        "within 200 of east west"   :'RRNe',
        "within 200 of North-South":'RRNn',
        "positive off site feature" :'PosA',
        "near positive"             :'PosN',
    };
    return conversions[value];
};


exports.exteriorConverter = (value) => {
    const conversions = {
        'asbestos shingles'         : 'AsbShng',
        'asphalt shingles'          : 'AsphShn',
        'brick face'                : 'BrkFace',
        'brick common'              : 'BrkComm',
        'cinder block'              : 'CBlock',
        'cement board'              : 'CemntBd',
        'hardboard'                 : 'HdBoard',
        'hardboard siding'          : 'HdBoard',
        'metal siding'              : 'MetalSd',
        'plywood'                   : 'Plywood',
        'precast concrete'          : 'PreCast',
        'stucco'                    : 'Stucco',
        'vinyl siding'              : 'VinylSd',
        'wood siding'               : 'Wd Sdng',
        'wood shingles'             : 'WdShing',
        'other'                     : 'Other',
        'imitation stucco'          : 'ImStucc',
        'stone'                     :'Stone'	
    };
    return conversions[value];
}

exports.masVnrTypeConverter = (value) => {
    const conversions = {
        'brick face'   : 'BrkFace',
        'brick common' : 'BrkCmn',
        'cinder block' : 'CBlock',
        "none"         : "None",
        "stone"	       : "Stone"
    } 
    return conversions[value];
};

exports.foundationConverter = (value)=>{
    const conversions = {
        'slab'           : 'Slab',
        "stone"	         : "Stone",
        'wood'           : 'Wood',
        'cinder block'   : 'CBlock',
        'brick and tile' : 'BrkTil',
        'poured contrete': 'PConc'
    };
    return conversions[value];
};

exports.bsmtFinType1Converter = (value)=>{
    const conversions = {
        'good'             : 'GLQ',
        "average"	       : "ALQ",
        'below average'    : 'BLQ',
        'average rec room' : 'Rec',
        'low'              : 'LwQ',
        'unfinished'       : 'Unf',
    };
    return conversions[value];
};

exports.bsmtExposureConverter = (value) => {
    const conversions = {
        'good'        : 'Gd',
        'average'     : 'Av',
        'minimum'     : 'Mn',
        'no exposure' : 'No' ,
    };
    return conversions[value];

}
exports.pavedDriveConverter = (value) => {
    const conversions = {
        'paved'    : 'Y',
        'gravel'   : 'N',
        'partial'  : 'P'
    };
    return conversions[value];
};