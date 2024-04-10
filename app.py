from flask import Flask, Blueprint, render_template_string, render_template, send_file, request, current_app, jsonify, redirect
from utils import allowed_file, is_pdf_size_valid
from flask_caching import Cache
from flask_cors import CORS, cross_origin
import tempfile
import os
import subprocess
import base64
import fitz
import logging

# def create_app():
#     app = Flask(__name__)
#     cors = CORS(app, origins='*')

#     #Konfiguracja cache'u
#     # app.config['CACHE_TYPE'] = 'simple'
#     # app.config['CACHE_DEFAULT_TIMEOUT'] = 300
#     # cache = Cache(app)

#     app.register_blueprint(pdf_blueprint, url_prefix='/pdf')

#     @app.route('/')
#     def home():
#         return render_template_string('''
#             <h1>Konwerter PDF na Gcode</h1>
#         ''')
#     return app

# # Tworzymy instancje dla aplikacji
# app = create_app()

app = Flask(__name__)
# cors = CORS(app, origins='*')
CORS(app, origins="*", supports_credentials=True) 
app.logger.setLevel(logging.DEBUG)  

pdf_blueprint = Blueprint('pdf_blueprint', __name__)

@pdf_blueprint.route('/upload-pdf', methods=['POST'])
def upload_pdf():
    try:
        print(request.method)
        print("Inside upload_pdf route")
        print(request.files)  # Log the content of the files received
        print(request.data)  # Print raw request data
        print(request.form)  # Print form data

        if request.method == 'POST':
            if 'file' in request.files:
                file = request.files['file']
                
                print(f"Filename: {file.filename}")  # Log filename
                print(f"File size: {len(file.read())}")  # Log file size
                # print(request.files['file'].read(500))

                if file.filename == '':
                    return jsonify({"error": "Nie wybrano żadnego pliku"}), 400
                
                if not allowed_file(file.filename):
                    return jsonify({"error": "Nieprawidlowy format pliku"}), 400
                
                # if file and allowed_file(file.filename):
                try:
                    temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
                    file.save(temp_pdf.name)
                    
                    #new log 14:59-10-04
                    print('Temp file created:', temp_pdf.name)
                    print('File exists, Size:', os.path.getsize(temp_pdf.name))
                    print('File contents (first 300 bytes):', file.read(300))
                    print('pdf_path before setPdfPath:', pdf_path)

                    file.seek(0)

                    #Turned off for tests.
                    # pdf_data = temp_pdf.read()

                    # if not is_pdf_size_valid(temp_pdf.name):
                    #     os.remove(temp_pdf.name)
                    #     return jsonify({"error": "Rozmiar dokumentu PDF przekracza 20cm"}), 400
                    
                    # cache_key = temp_pdf.name
                    # cache.set(cache_key, pdf_data, timeout=3600)

                    print("PDF Path:", temp_pdf.name)  # Verify the temporary file path

                    #tests:Latest14:13-10-04
                    if os.path.exists(temp_pdf.name):
                        print('File exists, Size:', os.path.getsize(temp_pdf.name))
                    else:
                        print('File does not exist!')

                    temp_pdf.close()
                    pdf_path = temp_pdf.name
                    # else:
                    # return jsonify({"error": "Nieprawidłowy format pliku"}), 400
                except Exception as e:
                    logging.exception("Unexpected error during file handling:", e)
                    return jsonify({"error": f"Błąd przetwarzania pliku: {str(e)}"}), 500
            else:
                print("No file found in the request") 
                return jsonify({"error": "Brak części plikowej"}), 400
            
        return jsonify({"message": "OK"})
    except Exception as e:
        logging.exception("Error during upload:", e)
        return jsonify({"error": "Internal server error"}), 500
        
@pdf_blueprint.route('/upload-pdf', methods=['GET'])
def redirect_from_get():
    return redirect('/')

@cross_origin()
@pdf_blueprint.route('/validate-pdf', methods=['POST'])
@cross_origin()
def validate_pdf():
    print('pdf_path received:', request.form['pdf_path'])
    # return jsonify({"message": "Test"}), 200
    if 'pdf_path' not in request.form:
        return jsonify({"error": "No pdf_path provided for validartion"})
    pdf_path = request.form['pdf_path']

    #Debugging
    if not os.path.exists(pdf_path):
        print('File does not exist:', pdf_path)
        #log 15:11-10-04
        logging.error("File does not exist after upload:", pdf_path) 

    # test 14:48-10-04
    try:
        if not is_pdf_size_valid(pdf_path):
            logging.error("File is empty or corrupt:", pdf_path)
            return jsonify({"error": "PDF size exceeds limit"})
    except Exception as e: 
        logging.exception("Unexpected error during validation:", e)
        return jsonify({"error": "Internal server error"}), 500
    
    return jsonify({"isValid": True})

@pdf_blueprint.route('/workfile/<path:pdf_path>')
def get_pdf(pdf_path):
    if cache.get(pdf_path):
        return send_file(pdf_path, as_attachment=False)
    else:
        return jsonify({"error": "Nie znaleziono pliku PDF"}), 404

       
@pdf_blueprint.route('/convert-pdf', methods=['POST'])
def convert_pdf():
    file_path = request.form.get('file_path')
    if not file_path:
        return jsonify({"error": "File path not received in request"}), 400
    if not os.path.exists(file_path):
        return jsonify({"error": "File does not exist at the provided path"}), 400

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


cache = Cache(app)
app.config['CACHE_TYPE'] = 'simple'
app.config['CACHE_DEFAULT_TIMEOUT'] = 3600
app.config['CORS_HEADERS'] = 'Content-Type'
app.register_blueprint(pdf_blueprint, url_prefix='/pdf')

if __name__ == '__main__':
    app.run(debug=True) 
