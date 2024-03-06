from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "PDF to G-code Conversion Service" })

@app.route('/upload-podf', methods=['POST'])
def upload_pdf():
    # Sprawdzamy plik w żądaniu
    if 'file' not in request.files:
	return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    # Nie wybrano pliku
    if file.filename == '':
	return jsonify({"error": "No selected file"}), 400
    # obsluga wczyt. pdf
    return jsonify({"success": "File uploaded successfully"})


if __name__ == '__main__':
    app.run(debug=True)
