from flask import request, jsonify
import flask
import pandas as pd
import numpy as np
import pickle
from sklearn.compose import  ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import  StandardScaler,  LabelEncoder
from sklearn.base import BaseEstimator, TransformerMixin
with open('./Models/prediction.pkl', 'rb') as file:
    Model = pickle.load(file)


def predict():
    X = request.json 
    X = X['residence']
    print(X['residence'])   
    try:
        X=pd.DataFrame(X)
        
        X_preprocessed = preprocessor.fit_transform(X)

        predictions = Model.predict(X_preprocessed)
        gg= np.expm1(predictions)[0]
        print(gg)
        return jsonify(gg), 200
    
    except Exception as e:
        e = list(e) if isinstance(e, set) else e
        print("Error during prediction:", str(e))  # Debug print statement
        return jsonify({'error': str(e)}), 500
    
    
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
    