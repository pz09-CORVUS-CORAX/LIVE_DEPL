from flask import Flask, Blueprint, render_template_string, render_template, send_file, request, current_app, jsonify, redirect, session
from utils import allowed_file, is_pdf_size_valid
from flask_caching import Cache
from flask_cors import CORS, cross_origin
import tempfile
import os
import subprocess
import base64
import fitz
import logging
import json

app = Flask(__name__)
# cors = CORS(app, origins='*')
CORS(app, origins="*", supports_credentials=True) 
app.logger.setLevel(logging.DEBUG)  
# ustawienia sesji

#log 01:00-11-04
custom_temp_dir = "static/temporaries" 

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
                
                print(f"Filename1: {file.filename}")  # Log filename
                print(f"File size1: {len(file.read())}")  # Log file size

                if file.filename == '':
                    return jsonify({"error": "Nie wybrano żadnego pliku"}), 400
                
                if not allowed_file(file.filename):
                    os.remove(file.filename)
                    return jsonify({"error": "Nieprawidlowy format pliku"}), 400
                
                # if file and allowed_file(file.filename):
                try:
                    temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf', dir=custom_temp_dir)
                    file.seek(0)  # Reset file pointer for reading
                    temp_pdf.write(file.read())
                    # temp_pdf.close()
                    #new log 17:05-10-04
                    print('Temp file created[/upload-pdf]:', temp_pdf.name)
                    print('File exists[/upload-pdf], Size:', os.path.getsize(temp_pdf.name))
                    print('File contents[/uplaod-pdf] (first 300 bytes):', file.read(300))
                    print('[/upload-pdf] pdf_path before setPdfPath(temp_pdf.name):', temp_pdf.name)

                    # temp_pdf.seek(0) 
                    initial_bytes = temp_pdf.read(300)
                    print("PDF Path(/upload-pdf -> temp_pdf.name):", temp_pdf.name)  # Verify the temporary file path

                    temp_pdf.close()
                    pdf_path = temp_pdf.name
                    print("Full absolute path of temp file:", os.path.abspath(temp_pdf.name))
                    
                    print("pdf_path in upload_pdf route: %s", pdf_path)
                    # else:
                    # return jsonify({"error": "Nieprawidłowy format pliku"}), 400
                except Exception as e:
                    logging.exception("Unexpected error during file handling:", e)
                    os.remove(pdf_path)
                    return jsonify({"error": f"Błąd przetwarzania pliku: {str(e)}"}), 500
            else:
                print("No file found in the request")
                os.remove(pdf_path)
                return jsonify({"error": "Brak części plikowej"}), 400
        # 22:48-11-04
        # os.remove(pdf_path)
        # new edit 09:58-11-04
        return jsonify({"pdf_path": pdf_path})
    except Exception as e:
        logging.exception("Error during upload:", e)
        return jsonify({"error": "Internal server error"}), 500
        
@pdf_blueprint.route('/upload-pdf', methods=['GET'])
def redirect_from_get():
    return redirect('/')

# @cross_origin()
@pdf_blueprint.route('/validate-pdf', methods=['POST'])
@cross_origin()
def validate_pdf():
    print(request.method)
    print("Inside validate-pdf route")
    print(request.files)  # Log the content of the files received
    print(request.data)  # Print raw request data
    print(request.form)  # Print form data

    if 'pdf_path' not in request.files:
        return jsonify({"error": "No path /w pdf provided for validation"}), 400
    
    pdf_file = request.files['pdf_path']

    temp_file = tempfile.NamedTemporaryFile(delete=False, dir=custom_temp_dir, suffix='.pdf')
    pdf_file.save(temp_file.name)
    pdf_path = temp_file.name
    print("The pdf_path is [validate-block]:", pdf_path)

    try: 
        if not is_pdf_size_valid(pdf_path):
            logging.error("File is empty or corrupt:", pdf_path)
            os.remove(pdf_path)
            return jsonify({"error": "PDF size exceeds limit[validate-block]"}), 413
    except FileNotFoundError:
        logging.error("File not found:", pdf_path)
        os.remove(pdf_path)
        return jsonify({"error": "PDF not Found[validate-block]"}), 404
    except Exception as e:
        logging.exception("Unexpected error during validation:", e)
        os.remove(pdf_path)
        return jsonify({"error": "Internal server error[validate-block]"}),
    os.remove(pdf_path)
    print("wypisz pliki w [validate-pdf]:", request.files)  # Log the content of the files received
    return jsonify({"isValid": True})


@pdf_blueprint.route('/workfile/<path:pdf_path>')
def get_pdf(pdf_path):
    if cache.get(pdf_path):
        return send_file(pdf_path, as_attachment=False)
    else:
        return jsonify({"error": "Nie znaleziono pliku PDF"}), 404

       
@pdf_blueprint.route('/convert-pdf', methods=['POST'])
def convert_pdf():
    print(request.method)
    print("Inside convert-pdf route")
    print(request.files)  # Log the content of the files received
    print(request.data)  # Print raw request data
    print(request.form)  # Print form data
    # edit 19:49-16-04 + 20:30-16-04
    file_path = request.form.get('pdf_path')
    #changelog 17:30-08-05
    drill_angle = request.form.get('drill_angle')
    drill_active_height = request.form.get('drill_active_height')
    drill_movement_speed = request.form.get('drill_movement_speed')
    print(file_path)
    if not file_path:

        return jsonify({"error": "File path not received in request"}), 400
    if not os.path.exists(file_path):
        return jsonify({"error": "File does not exist at the provided path"}), 400

    #log23:59-24-04
    original_dir = os.getcwd()
    print("original dir pa tera:", original_dir)
    try:
        #1
        print("file_path przed procesesm", file_path)
        #changelog 17:30-08-05
        subprocess.check_call([
            'fontforge', '-script', 'font_extractor/font_extractor.py', f'"{file_path}"', 
         drill_angle, drill_active_height, drill_movement_speed
    ])
        #2. log23:00-29.04:
        with open('gcode.gcode', 'r') as f:
            gcode_content = f.read()

        return gcode_content, 200, {
            'Content-Type': 'text/plain',  # Or another appropriate MIME type 
            'Content-Disposition': 'attachment; filename=converted.gcode'
        }
    except subprocess.CalledProcessError as e:
        logging.error("Failed to convert PDF to SVG: %s", e)
        return jsonify({"error": "Failed to convert PDF to SVG"}), 500
    
    finally:
        while os.path.exists(file_path):
            os.remove(file_path)
        cleanup_files = ['fonts.json', 'pdf_text.json', 'gcode.gcode']
        for file_to_delete in cleanup_files:
            if os.path.exists(file_to_delete):
                os.remove(file_to_delete) 
        
        for fontfilename in os.listdir():
            if fontfilename.endswith('.svg'):
                os.remove(fontfilename)


cache = Cache(app)
app.config['CACHE_TYPE'] = 'simple'
app.config['CACHE_DEFAULT_TIMEOUT'] = 3600
app.config['CORS_HEADERS'] = 'Content-Type'
app.register_blueprint(pdf_blueprint, url_prefix='/pdf')

if __name__ == '__main__':
    app.run(debug=True) 
