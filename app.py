from flask import Flask, Blueprint, render_template_string, render_template, send_file, request, current_app, jsonify, redirect
from utils import allowed_file, is_pdf_size_valid
from flask_caching import Cache
from flask_cors import CORS
import tempfile
import os
import subprocess
import base64
import fitz


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
CORS(app, origins='*')

pdf_blueprint = Blueprint('pdf_blueprint', __name__)

@pdf_blueprint.route('/upload-pdf', methods=['POST'])
def upload_pdf():
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

                #Turned off for tests.
                # pdf_data = temp_pdf.read()

                # if not is_pdf_size_valid(temp_pdf.name):
                #     os.remove(temp_pdf.name)
                #     return jsonify({"error": "Rozmiar dokumentu PDF przekracza 20cm"}), 400
                
                # cache_key = temp_pdf.name
                # cache.set(cache_key, pdf_data, timeout=3600)
                temp_pdf.close()

                print("PDF Path:", temp_pdf.name)  # Verify the temporary file path

                return jsonify({"pdf_path": temp_pdf.name})
                # else:
                # return jsonify({"error": "Nieprawidłowy format pliku"}), 400
            except Exception as e:
                return jsonify({"error": f"Błąd przetwarzania pliku: {str(e)}"}), 500
        else:
            print("No file found in the request") 
            return jsonify({"error": "Brak części plikowej"}), 400
        
    return jsonify({"message": "OK"})
        
@pdf_blueprint.route('/upload-pdf', methods=['GET'])
def redirect_from_get():
    return redirect('/')

@pdf_blueprint.route('/validate-pdf', methods=['POST'])
def validate_pdf():
    if 'pdf_path' not in request.form:
        return jsonify({"error": "No pdf_path provided for validartion"})
    pdf_path = request.form['pdf_path']

    if not is_pdf_size_valid(pdf_path):
        return jsonify({"error": "PDF size exceeds limit"})

    # Assuming your file saving in 'upload_pdf' works as intended
    
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
app.register_blueprint(pdf_blueprint, url_prefix='/pdf')

if __name__ == '__main__':
    app.run(debug=True) 
