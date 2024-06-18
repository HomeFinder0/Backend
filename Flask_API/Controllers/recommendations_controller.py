from flask import request, jsonify
from werkzeug.exceptions import BadRequest
import os
import pickle
import pandas as pd
import numpy as np

# Define the directory where the model is stored
model_dir = 'Models'

# Define the name of the model file
model_file = 'recommendation_model.pkl'

# Create the full path to the model file
model_path = os.path.join(model_dir, model_file)

print(f"Loading model from: {model_path}")

with open(model_path, 'rb') as f:
    model_data = pickle.load(f)
    similarity_matrix = model_data.get('similarity_matrix')
    df = model_data.get('data_frame')


def recommend_similar_houses(house_id, n=10, model=similarity_matrix):
    # Create a mapping from house IDs to indices
    id_to_index = {id_: idx for idx, id_ in enumerate(df['Id'])}

    # Check if the house_id exists in the dataset
    if house_id not in id_to_index:
        print(f"House ID {house_id} does not in the dataset.")
        return [], pd.DataFrame()  # Return empty results

    # Find the index for the given house ID
    house_index = id_to_index[house_id]

    # Calculate similarity scores
    similarity_scores = list(enumerate(model[house_index]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

    # Get the top N indices (excluding the house itself)
    top_n_indices = [i[0] for i in similarity_scores[1:n + 1]]

    # Get the IDs of the top similar houses
    top_n_ids = df.iloc[top_n_indices]['Id'].tolist()

    # Get the details of the top similar houses
    similar_houses_data = df.iloc[top_n_indices]

    return top_n_ids, similar_houses_data


def recommend():
    try:
        data = request.get_json(force=True)
    except BadRequest:
        return jsonify({'error': 'Invalid JSON format'}), 400

    house_id = data.get('house_id')  # Use get method instead of direct access
    n_recommendations = data.get('no_recommendations', 10)  # Default to 10 recommendations if not provided

    if house_id is None or not house_id:
        return jsonify({'error': 'House ID not provided'}), 400

    if(n_recommendations is None or n_recommendations < 1):
        n_recommendations = 10
        
    recommended_ids, recommended_houses = recommend_similar_houses(house_id, n_recommendations, similarity_matrix)

    if recommended_ids:
        result = {
            'recommended_ids': recommended_ids,
        }
        return jsonify(result)
    else:
        return jsonify({'error': 'House ID not found'}), 404
