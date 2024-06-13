from flask import Flask, request, jsonify
import pickle
import pandas as pd

predictionModel = pickle.load(open('./Models/prediction.pkl', 'rb'))
def predict():
    _json = request.json    
    try:
        # Convert the JSON object to a pandas DataFrame
        query_df = pd.DataFrame([_json])
        
        # Make a prediction
        prediction = predictionModel.predict(query_df)  # Model expects a 2D array
        price = float(prediction[0])  # Assuming the model returns a 1D array, get the first value as float
        print("Prediction result:", price)  # Debug print statement
        
        # Return the prediction as a JSON response
        return jsonify({'prediction price: ': price})
    
    except Exception as e:
        print("Error during prediction:", str(e))  # Debug print statement
        return jsonify({'error': str(e)}), 500
