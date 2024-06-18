import pandas as pd
import numpy as np
import pickle
from sklearn.compose import  ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import  StandardScaler,  LabelEncoder
from sklearn.base import BaseEstimator, TransformerMixin
with open('Flask_API\Models\Model.pkl', 'rb') as file:
    Model = pickle.load(file)

X = {
    "msSubClass": [60],
    "mszoning": ["RL"],
    "lotFrontage": [68],
    "lotArea": [11250],
    "street": ["Pave"],
    "lotShape": ["IR1"],
    "landContour": ["Lvl"],
    "utilities": ["AllPub"],
    "lotConfig": ["Inside"],
    "landSlope": ["Gtl"],
    "neighborhood": ["CollgCr"],
    "condition1": ["Norm"],
    "condition2": ["Norm"],
    "bldgType": ["1Fam"],
    "houseStyle": ["2Story"],
    "overallQual": [7],
    "overallCond": [5],
    "roofStyle": ["Gable"],
    "roofMatl": ["CompShg"],
    "exterior1st": ["VinylSd"],
    "exterior2nd": ["VinylSd"],
    "masVnrType": ["BrkFace"],
    "masVnrArea": [162],
    "exterQual": ["Gd"],
    "exterCond": ["TA"],
    "foundation": ["PConc"],
    "bsmtQual": ["Gd"],
    "bsmtCond": ["TA"],
    "bsmtExposure": ["Mn"],
    "bsmtFinType1": ["GLQ"],
    "bsmtUnfSF": [434],
    "heating": ["GasA"],
    "heatingQc": ["Ex"],
    "centralAir": ["Y"],
    "electrical": ["SBrkr"],
    "lowQualFinSF": [0],
    "bedroomAbvGr": [3],
    "kitchenAbvGr": [1],
    "kitchenQual": ["Gd"],
    "totRmsAbvGrd": [6],
    "Functional": ["Typ"],
    "fireplaceQu": ["TA"],
    "fireplaces": [1],
    "garageType": ["Attchd"],
    "garageFinish": ["RFn"],
    "garageCars": [2],
    "garageQual": ["TA"],
    "pavedDrive": ["Y"],
    "poolArea": [0],
    "miscVal": [0],
    "moSold": [9],
    "saleType": ["WD"],
    "saleCondition": ["Normal"],
    "salePrice": [12.31717117],
    "houseage": [7],
    "houseremodelage": [6],
    "totalsf": [2272],
    "totalarea": [2706],
    "totalbaths": [3.5],
    "totalporchsf": [42],
    "alley": ["NA"]
}

X=pd.DataFrame(X)

class LabelEncodingTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.label_encoders = {}

    def fit(self, X, y=None):
        for col in X.columns:
            le = LabelEncoder()
            le.fit(X[col])
            self.label_encoders[col] = le
        return self

    def transform(self, X):
        X_transformed = X.copy()
        for col in X_transformed.columns:
            X_transformed[col] = self.label_encoders[col].transform(X_transformed[col])
        return X_transformed

    def fit_transform(self, X, y=None):
        return self.fit(X, y).transform(X)

    def get_params(self, deep=True):
        return {}

    def set_params(self, **params):
        return self


numerical_cols = ['msSubClass', 'lotFrontage', 'lotArea', 'masVnrArea', 'bsmtUnfSF', 'lowQualFinSF', 'bedroomAbvGr', 
                  'kitchenAbvGr', 'totRmsAbvGrd', 'fireplaces', 'garageCars', 'poolArea', 'miscVal', 'moSold', 
                  'houseage', 'houseremodelage', 'totalsf', 'totalarea', 'totalbaths', 'totalporchsf']

categorical_cols = ['mszoning', 'street', 'lotShape', 'landContour', 'utilities', 'lotConfig', 'landSlope', 'neighborhood', 
                    'condition1', 'condition2', 'bldgType', 'houseStyle', 'roofStyle', 'roofMatl', 'exterior1st', 
                    'exterior2nd', 'masVnrType', 'foundation', 'heating', 'electrical', 'Functional', 'garageType', 
                    'saleType', 'saleCondition', 'overallQual', 'overallCond', 'exterQual', 'exterCond', 'bsmtQual', 
                    'bsmtCond', 'bsmtExposure', 'bsmtFinType1', 'heatingQc', 'centralAir', 'kitchenQual', 'fireplaceQu', 
                    'garageFinish', 'garageQual', 'pavedDrive']

numerical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='mean')),
    ('scaler', StandardScaler())
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_transformer, numerical_cols),
        ('cat', LabelEncodingTransformer(), categorical_cols)
    ]
)


X_preprocessed = preprocessor.fit_transform(X)

predictions = Model.predict(X_preprocessed)
gg= np.expm1(predictions)[0]
print(gg)
