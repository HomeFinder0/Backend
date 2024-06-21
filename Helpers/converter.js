exports.utilitiesConverter = (value) => {
    const conversions = {
        'AllPub': 'All public Utilities',
        'ELO': 'Electricity',
        'NoSeWa': 'Electricity and Gas',
        'NoSewr': 'Electricity and Water'
    };
    return conversions[value];
}


exports.msSubClassConverter = (value) => {
    const conversions = {
        "1story and newer": 20, 20: "1story and newer",
        "1story and older": 30, 30: "1story and older",
        "2story and newer": 60, 60: "2story and newer",
        "2story and older": 70, 70: "2story and older",
        "1 story finished attic": 40, 40: "1 story finished attic",
        "1 story unfinished attic": 45, 45: "1 story unfinished attic",
        "multi-level": 80, 80: "multi-level",
        "split foyer": 85, 85: "split foyer",
        "duplex": 90, 90: "duplex",
        "multilevel and split": 180, 180: "multilevel and split",
        "2 family conversion": 190, 190: "2 family conversion"
    };

    return conversions[value];
};

exports.bldgTypeConverter = (value) => {
    const conversions = {
        'single-family': '1Fam', '1Fam': 'single-family',
        'two-family': '2fmCon', '2fmCon': 'two-family',
        'duplex': 'Duplex', 'Duplex': 'duplex',
        'townhouse end unit': 'TwnhsE', 'TwnhsE': 'townhouse end unit',
        'townhouse inside unit': 'TwnhsI', 'TwnhsI': 'townhouse inside unit',
        'Twnhs': 'townhouse', 'townhouse': 'Twnhs'
    };

    return conversions[value];
};

exports.qualityRatingConverter = (value) => {
    const conversions = {
        'good': 'Gd', 'Gd': 'good',
        'fair': 'Fa', 'Fa': 'fair',
        'poor': 'Po', 'Po': 'poor',
        'average': 'TA', 'TA': 'average',
        'excellent': 'Ex', 'Ex': 'excellent',
        'not available': 'NO', 'NO': 'not available',
    };

    return conversions[value];
}
exports.centralAirConverter = (value) => {
    const conversions = {
        'yes': 'Y', 'Y': 'yes',
        'no': 'N', 'N': "no"
    };

    return conversions[value];
};

exports.neighborhoodConverter = (value) => {
    const conversions = {
        'bloomington heights': 'Blmngtn', 'Blmngtn': "bloomington heights",
        'bluestem': 'Blueste', "Blueste": "bluestem",
        'briardale': 'BrDale', 'BrDale': 'briardale',
        'clear creek': 'ClearCr', 'ClearCr': 'clear creek',
        'college creek': 'CollgCr', 'CollgCr': 'college creek',
        'crawford': 'Crawfor', 'Crawfor': 'crawford',
        'edwards': 'Edwards', 'Edwards': 'edwards',
        'gilbert': 'Gilbert', 'Gilbert': 'gilbert',
        'iowa dot and rail road': 'IDOTRR', 'IDOTRR': 'iowa dot and rail road',
        'meadow village': 'MeadowV', 'MeadowV': 'meadow village',
        'mitchell': "Mitchel", 'Mitchel': 'mitchell',
        'north ames': 'NAmes', 'NAmes': 'north ames',
        'northridge': 'NoRidge', 'NoRidge': 'northridge',
        'northpark villa': 'NPkVill', 'NPkVill': 'northpark villa',
        'northridge heights': 'NridgHt', 'NridgHt': 'northridge heights',
        'northwest ames': 'NWAmes', 'NWAmes': 'northwest ames',
        'old town': 'OldTown', 'OldTown': 'old town',
        'sawyer': 'Sawyer', 'Sawyer': 'sawyer',
        'sawyer west': 'SawyerW', 'SawyerW': 'sawyer west',
        'somerset': 'Somerst', 'Somerst': 'somerset',
        'stone brook': 'StoneBr', 'StoneBr': 'stone brook',
        'timberland': 'Timber', 'Timber': 'timberland',
        'veenker': 'Veenker', 'Veenker': 'veenker',
        'south & west of iowa state university': 'SWISU', 'SWISU': 'south & west of iowa state university'
    };

    return conversions[value];
};



exports.mszoningConverter = (value) => {
    const conversions = {
        'agricultural': 'A', 'A': 'agricultural',
        'commercial': 'C', 'C': 'commercial',
        'floating village': 'FV', 'FV': 'floating village',
        'industrial': 'I', 'I': 'industrial',
        'high residential': 'RH', 'RH': 'high residential',
        'low': 'RL', 'RL': 'low',
        'park': 'RP', 'RP': 'park',
        'medium': 'RM', 'RM': 'medium'
    };

    return conversions[value];
};

exports.roofMaterialsConverter = (value) => {
    const conversions = {
        'roll': 'Roll', 'roll': 'roll',
        'metal': 'Metal', 'Metal': 'metal',
        'membran': 'Membran', 'Membran': 'membran',
        'wood shakes': 'WdShake', 'WdShake': 'wood shakes',
        'gravel & tar': 'Tar&Grv', 'Tar&Grv': 'gravel & tar',
        'clay or tile': 'ClyTile', 'ClyTile': 'clay or tile',
        'wood shingles': 'WdShngl', 'WdShngl': 'wood shingles',
        'standard shingle': 'CompShg', 'CompShg': 'standard shingle'
    }
    return conversions[value];
};

exports.garageConverter = (value) => {
    const conversions = {
        'finished': 'Fin', 'Fin': 'finished',
        'rough finished': 'RFn', 'RFn': 'rough finished',
        'unfinished': 'Unf', 'Unf': 'unfinished',
        'not available': 'No', 'No': 'not available',

        'built in': 'BuiltIn', 'BuiltIn': 'built in',
        'car port': 'CarPort', 'CarPort': 'car port',
        'more than one': '2Types', '2Types': 'more than one',
        'basement garage': 'Basment', 'Basment': 'basement garage',
        'attached': 'Attchd', 'Attchd': 'attached',
        'Detached': 'Detchd', 'Detchd': 'Detached'
    }
    return conversions[value];
}

exports.saleConditionConverter = (value) => {
    const conversions = {
        'normal': 'Normal', 'Normal': 'normal',
        'abnormal': 'Abnorml', 'Abnorml': 'abnormal',
        'adjoining land purchase': 'AdjLand', 'AdjLand': 'adjoining land purchase',
        'allocation': 'Alloca', 'Alloca': 'allocation',
        'family': 'Family', 'Family': 'family',
        'partial': 'Partial', 'Partial': 'partial'

    }
    return conversions[value];
}

exports.saleTypeConverter = (value) => {
    const conversions = {
        'other': 'Oth', 'Oth': 'other',
        'conventional': 'WD', 'WD': 'conventional',
        'cash': 'CWD', 'CWD': 'cash',
        'va loan': 'VWD', 'VWD': 'va loan',
        'new': 'New', 'New': 'new',
        'court officer deed/estate': 'COD', 'COD': 'court officer deed/estate',
        'contract low interest': 'ConLI', 'ConLI': 'contract low interest',
        'contract low down': 'ConLD', 'ConLD': 'contract low down',
        'contract 15% down payment regular terms': 'Con', 'Con': 'contract 15% down payment regular terms',
        'contract low down payment and low intere': 'ConLw', 'ConLw': 'contract low down payment and low intere'
    }
    return conversions[value];
}
exports.alleyConverter = (value) => {
    const conversions = {
        'gravel': 'Grvl', 'Grvl': 'gravel',
        'paved': 'Pave', 'Pave': 'paved',
        'no alley access': 'NA', 'NA': 'no alley access'
    };

    return conversions[value];
}
exports.streetConverter = (value) => {
    const conversions = {
        'gravel': 'Grvl', 'Grvl': 'gravel',
        'paved': 'Pave', 'Pave': 'paved',
    }
    return conversions[value];
}

exports.electricalConverter = (value) => {
    const conversions = {
        'standard circuit breakers & romex': 'SBrkr', 'SBrkr': 'standard circuit breakers & romex',
        'average': 'FuseA', 'FuseA': 'Average',
        'fair': 'FuseF', 'FuseF': 'Fair',
        'poor': 'FuseP', 'FuseP': 'poor',
        'mixed': 'Mix', 'Mix': 'mixed'
    }
    return conversions[value];
}
exports.heatingConverter = (value) => {
    const conversions = {
        'floor': 'Floor', 'Floor': 'floor',
        'gas': 'GasA', 'GasA': 'gas',
        'gas water': 'GasW', 'GasW': 'gas water',
        'gravity': 'Grav', 'Grav': 'gravity',
        'other water': 'OthW', 'OthW': 'other water',
        'wall': 'Wall', 'Wall': 'wall'
    }
    return conversions[value];
}


exports.lotShapeConverter = (value) => {
    const conversions = {
        'regular': 'Reg', 'Reg': 'regular',
        'slightly': 'IR1', 'IR1': 'slightly',
        'moderately': 'IR2', 'IR2': 'moderately',
        'irregular': 'IR3', 'IR3': 'irregular'
    }
    return conversions[value];
}

exports.landContourConverter = (value) => {
    const conversions = {
        'level': 'Lvl', 'Lvl': 'level',
        'banked': 'Bnk', 'Bnk': 'banked',
        'hillside': 'HLS', 'HLS': 'hillside',
        'depression': 'Low', 'Low': 'depression'
    }
    return conversions[value];
}

exports.lotConfigConverter = (value) => {
    const conversions = {
        'inside': "Inside", 'Inside': 'inside',
        'corner': "Corner", 'Corner': 'corner',
        'cul de sac': "CulDSac", 'CulDSac': 'cul de sac',
        'frontage on 2': 'FR2', 'FR2': 'frontage on 2',
        'frontage on 3': 'FR3', 'FR3': 'frontage on 3'
    };

    return conversions[value];
};

exports.landSlopeConverter = (value) => {
    const conversions = {
        'gentle': 'Gtl', 'Gtl': 'gentle',
        'moderate': 'Mod', 'Mod': 'moderate',
        'severe': 'Sev', 'Sev': 'severe'
    };
    return conversions[value];
};

exports.condConverter = (value) => {
    const conversions = {
        'normal': 'Norm', 'Norm': 'normal',
        'adjacent to feeder street': 'Feedr', 'Feedr': 'adjacent to feeder street',
        'adjacent to arterial street': 'Artery', 'Artery': 'adjacent to arterial street',
        "adjacent to east west railroad": 'RRAe', 'RRAe': "adjacent to east west railroad",
        'adjacent to north south': 'RRAn', 'RRAn': 'adjacent to north south',
        "within 200 of east west": 'RRNe', 'RRNe': "within 200 of east west",
        "within 200 of north south": 'RRNn', 'RRNn': "within 200 of north-south",
        'adjacent to positive off site feature': 'PosA', 'PosA': 'adjacent to positive off site feature',
        'near positive off-site feature': 'PosN', 'PosN': 'near positive off-site feature',
    };
    return conversions[value];
};

exports.exteriorConverter = (value) => {
    const conversions = {
        'asbestos shingles': 'AsbShng', 'AsbShng': 'asbestos shingles',
        'asphalt shingles': 'AsphShn', 'AsphShn': 'asphalt shingles',
        'brick face': 'BrkFace', 'BrkFace': 'brick face',
        'brick common': 'BrkComm', 'BrkComm': 'brick common',
        'cinder block': 'CBlock', 'CBlock': 'cinder block',
        'cement board': 'CmentBd', 'CmentBd': 'cement board',
        'CemntBd': 'cement board', 'cement board': 'CemntBd',
        'Brk Cmn': 'brick common', 'brick common': 'Brk Cmn',
        'hardboard': 'HdBoard', 'HdBoard': 'hardboard siding',
        'hardboard siding': 'HdBoard', 'HdBoard': 'hardboard siding',
        'metal siding': 'MetalSd', 'MetalSd': 'metal siding',
        'plywood': 'Plywood', 'Plywood': 'plywood siding',
        'precast concrete': 'PreCast', 'PreCast': 'precast concrete',
        'stucco': 'Stucco', 'Stucco': 'stucco',
        'vinyl siding': 'VinylSd', 'VinylSd': 'vinyl siding',
        'wood siding': 'Wd Sdng', 'Wd Sdng': 'wood siding',
        'WdShing': 'wood shingles','wood shingles': 'WdShing',
        'wood shingles': 'Wd Shng', 'Wd Shng': 'wood shingles',
        'other': 'Other', 'Other': 'other',
        'imitation stucco': 'ImStucc', 'ImStucc': 'imitation stucco',
        'stone': 'Stone', 'Stone': 'stone'
    };
    return conversions[value];
}

exports.masVnrTypeConverter = (value) => {
    const conversions = {
        'brick face': 'BrkFace', 'BrkFace': 'brick face',
        'brick common': 'BrkCmn', 'BrkCmn': 'brick common',
        'cinder block': 'CBlock', 'CBlock': 'cinder block',
        "no": "No", 'No': 'no',
        "stone": "Stone", 'Stone': 'stone'
    }
    return conversions[value];
};

exports.foundationConverter = (value) => {
    const conversions = {
        'slab': 'Slab', 'Slab': 'slab',
        "stone": "Stone", 'Stone': 'stone',
        'wood': 'Wood', 'Wood': 'wood',
        'cinder block': 'CBlock', 'CBlock': 'cinder block',
        'brick and tile': 'BrkTil', 'BrkTil': 'brick and tile',
        'poured contrete': 'PConc', 'PConc': 'poured contrete'
    };
    return conversions[value];
};

exports.bsmtFinType1Converter = (value) => {
    const conversions = {
        'good': 'GLQ', 'GLQ': 'good',
        "average": "ALQ", 'ALQ': 'average',
        'below average': 'BLQ', 'BLQ': 'below average',
        'average rec room': 'Rec', 'Rec': 'average rec room',
        'low': 'LwQ', 'LwQ': 'low',
        'unfinished': 'Unf', 'Unf': 'unfinished',
    };
    return conversions[value];
};

exports.bsmtExposureConverter = (value) => {
    const conversions = {
        'good': 'Gd', 'Gd': 'good',
        'average': 'Av', 'Av': 'average',
        'minimum': 'Mn', 'Mn': 'minimum',
        'no exposure': 'No', 'No': 'no exposure'
    };
    return conversions[value];

}
exports.pavedDriveConverter = (value) => {
    const conversions = {
        'paved': 'Y', 'Y': 'paved',
        'gravel': 'N', 'N': 'gravel',
        'partial': 'P', 'P': 'partial',
    };
    return conversions[value];
};