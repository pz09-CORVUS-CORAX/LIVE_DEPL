from flask import Flask, request, send_file, jsonify, render_template_string, redirect, url_for
from pdf2image import convert_from_path
import tempfile
import subprocess
import os
import PyPDF2

app = Flask(__name__)

@app.route('/')
def home():
    return render_template_string('''
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
    ''')

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
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
                file.save(temp_pdf.name)

                if not is_pdf_size_valid(temp_pdf.name):
                    os.remove(temp_pdf.name)
                    return jsonify({"error": "PDF page size exceeds 20cm x 20cm"}), 400
                return render_template_string('''
                    Uploaded successfully! <br>
                    <form action="{{ url_for('convert_pdf') }}" method="post">
                        <input type="hidden" name="file_path" value={{ temp_pdf_name }}">
                        <input type="submit" value="Convert PDF" class="btn">
                    </form>
                ''', temp_pdf_name = temp_pdf.name)

    return '''
        <form action="/upload-pdf" method="post" enctype="multipart/form-data">
            Select PDF to upload:
            <input type="file" name="file">
            <input type="submit" value="Upload PDF">
        </form>
    '''                                                                
    
@app.route('/convert-pdf', methods=['POST'])
def convert_pdf():
    file_path = request.form.get('file_path')
    if not file_path or not os.path.exists(file_path):
        return jsonify({"error": "Invalid file path"}), 400
    
    output_svg_path = file_path + '.svg'
    try:
        subprocess.check_call(['pdf2svg', file_path, output_svg_path, '1'])
        return send_file(output_svg_path, as_attachment=True, download_name='converted.svg', mimetype='image/svg+xml')
    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Failed to convert PDF to SVG"}), 500
    finally:
        #Cleanup plikow
        if os.path.exists(file_path):
            os.remove(file_path)
        if os.path.exists(output_svg_path):
            os.remove(output_svg_path)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() == 'pdf'

def is_pdf_size_valid(pdf_path, max_width_cm = 20, max_height_cm = 20):
    with open(pdf_path, 'rb') as f:
        pdf = PyPDF2.PdfReader(f)
        page = pdf.pages[0] # MVP - we're taking only 1st page.
        width, height = page.mediabox.upper_right
        width_cm = float(width) / float(72 * 2.54)
        height_cm = float(height) / float(72 * 2.54)
        return width_cm <= max_width_cm and height_cm <- max_height_cm

if __name__ == '__main__':
    app.run(debug=True)
