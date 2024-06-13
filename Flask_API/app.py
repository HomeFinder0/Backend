from flask import Flask
from Controllers.prediction_controller import predict

app = Flask(__name__)

@app.route("/")
def hello():
    return "Welcome to flask APIs!"


@app.route("/predict", methods=['POST'])
def predict_route():
    return predict()

if __name__ == '__main__':
    app.run(debug=True)