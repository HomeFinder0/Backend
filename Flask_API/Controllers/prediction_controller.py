from flask import request, jsonify
import pandas as pd
import numpy as np
import pickle

# Load the pre from the file
with open(r".\Models\preprocessor.pkl", 'rb') as file:
    preprocessor = pickle.load(file)
    
# Load the model from the file
with open(r".\Models\prediction_model.pkl", 'rb') as file:
    Model = pickle.load(file)

def predict():
    X = request.json 
    X =[X['residence']]
    try:
        X=pd.DataFrame(X)
        
        #Check if all necessary columns are present in the input
        check_columns(X)

        X_preprocessed = preprocessor.transform(X)
        predictions = Model.predict(X_preprocessed)
        gg= np.expm1(predictions)[0]

        return jsonify(float(gg)), 200  # Convert float32 to float    
    except Exception as e:
        e = list(e) if isinstance(e, set) else e
        print("Error during prediction:", str(e))  # Debug print statement
        return jsonify({'error': str(e)}), 500


def check_columns(X):
    necessary_columns = [ "msSubClass","mszoning","lotFrontage", "lotArea","street", "lotShape","landContour","utilities","lotConfig","landSlope",
"neighborhood","condition1", "condition2","bldgType","houseStyle","overallQual","overallCond","roofStyle", "roofMatl","exterior1st","exterior2nd",
"masVnrType","masVnrArea","exterQual","exterCond","foundation","bsmtQual","bsmtCond","bsmtExposure","bsmtFinType1","bsmtUnfSF","heating","heatingQc",
"centralAir", "electrical", "lowQualFinSF","bedroomAbvGr","kitchenAbvGr","kitchenQual","totRmsAbvGrd","Functional","fireplaceQu","fireplaces",
"garageType","garageFinish","garageCars", "garageQual","pavedDrive","poolArea","miscVal","moSold","saleType","saleCondition","salePrice","houseage",
"houseremodelage","totalsf","totalarea", "totalbaths","totalporchsf","alley"]  
    
    missing_columns = [col for col in necessary_columns if col not in X.columns]
    if missing_columns:
            raise ValueError(f"Missing columns in input: {missing_columns}")
    