from flask import Flask, request, jsonify
from pdf2image import convert_from_path
import tempfile
import math

app = Flask(__name__)

@app.route('/')
def home():
    return '''
        <h1>PDF to G-code Conversion Service</h1>
        <a href="/upload-pdf" class="btn">Upload PDF</a>
        <style>
            .btn {
                display: inline-block;
                paddingL 10px 20px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px
            }
        </style>
    '''

@app.route('/upload-pdf', methods=['POST', 'GET'])
def upload_pdf():
    if request.method == 'POST':
        # Sprawdzamy plik w żądaniu
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        # Nie wybrano pliku
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        # obsluga wczyt. pdf
        if file and allowed_file(file.filename):
            # zapis jako temp file
            with tempfile.NamedTemporaryFile(delete=False) as temp:
                file.save(temp.name)
                images = convert_from_path(temp.name, first_page=0, last_page=1)

                if images:
                    image = images[0]
                    width_cm = pixels_to_cm(image.width, dpi = 300)
                    height_cm = pixels_to_cm(image.height, dpi = 300)

                    if width_cm > 20 or height_cm > 20:
                        return jsonify({"error": "PDF Size - ponad limit"}), 400
                    return jsonify({"success": "PDF validated successfully", "size": f"{width_cm}cm x {height_cm}cm"}), 200
                
        return jsonify({"error": "Invalid file"}), 400
    else: 
        return '''
            <form action="/upload-pdf" method="post" enctype="multipart/form-data">
                Select PDF to upload:
                <input type="file" name="file">
                <input type="submit" value="Upload PDF">
            </form>
        '''

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ['pdf']

def pixels_to_cm(pixels, dpi):
    inches = pixels / dpi
    return inches * 2.54

if __name__ == '__main__':
    app.run(debug=True)
