from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "PDF to G-code Conversion Service"

if __name__ == '__main__':
    app.run(debug=True)
