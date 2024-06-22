from flask import request, jsonify
import pandas as pd
import numpy as np
import pickle
import os

# Define the directory where the model is stored
model_dir = 'Models'

# Define the name of the model file
model_file = 'XGBModel.pkl'
preprocessor_file = 'preprocessor.pkl'

# Create the full path to the model file
model_path = os.path.join(model_dir, model_file)
preprocessor_path = os.path.join(model_dir, preprocessor_file)
print(f"Loading model from: {model_path}")

# Load the preprocessor from the file
with open(preprocessor_path, 'rb') as file:
    preprocessor = pickle.load(file)

# Load the model from the file
with open(model_path, 'rb') as file:
    Model = pickle.load(file)

with open(".\Models\preprocessor.pkl", 'rb') as file:
    preprocessor = pickle.load(file)

# Load the model from the file
with open(".\Models\XGBModel.pkl", 'rb') as file:
    Model = pickle.load(file)

def predict():
    X = request.json 
    X =[X['residence']] 
    try:
        X=pd.DataFrame(X)
        #Check if all necessary columns are present in the input
        #check_columns(X)

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
    