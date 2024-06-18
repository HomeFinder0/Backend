from flask import Flask
from Controllers.prediction_controller import predict
import os

app = Flask(__name__)
port = int(os.environ.get('PORT', 5000))
@app.route("/")
def hello():
    return "Welcome to flask APIs!"


@app.route("/predict", methods=['POST'])
def predict_route():
    return predict()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)