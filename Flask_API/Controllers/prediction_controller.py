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

with open(preprocessor_path, 'rb') as file:
    preprocessor = pickle.load(file)

# Load the model from the file
with open(model_path, 'rb') as file:
    Model = pickle.load(file)

def predict():
    X = request.json 
    X =[X['residence']] 
    try:
        X=pd.DataFrame(X)

        X_preprocessed = preprocessor.transform(X)
        predictions = Model.predict(X_preprocessed)
        gg= np.expm1(predictions)[0]

        return jsonify(float(gg)), 200  # Convert float32 to float    
   
    except Exception as e:
        e = list(e) if isinstance(e, set) else e
        print("Error during prediction:", str(e))  # Debug print statement
        return jsonify({'error': str(e)}), 500

