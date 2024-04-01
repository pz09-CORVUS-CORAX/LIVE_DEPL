from flask import Flask, Blueprint, jsonify, render_template_string, send_file, request, current_app
from utils import allowed_file, is_pdf_size_valid
from flask_caching import Cache
import tempfile
import os
import subprocess

current_app.config['CACHE_TYPE'] = 'simple'
current_app.config['CACHE_DEFAULT_TIMEOUT'] = 300
cache = Cache(current_app)

pdf_blueprint = Blueprint('pdf_blueprint', __name__ )
@pdf_blueprint.route('/upload-pdf', methods=['POST', 'GET'])
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
            # with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
                # file.save(temp_pdf.name)
            temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            file.save(temp_pdf.name)
            temp_pdf.close()

            if not is_pdf_size_valid(temp_pdf.name):
                pdf_filename = os.path.basename(temp_pdf.name)
                os.remove(temp_pdf.name)
                return jsonify({"error": "PDF page size exceeds 20cm x 20cm"}), 400
            
            # zapis pliku do cache'u
            cache_key = 'pdf_file_{}'.format(file.filename)
            cache.set(cache_key, file.read(), timeout=3600)

            return render_template_string('''
                Uploaded successfully! <br>
                <form action="{{ url_for('pdf_blueprint.convert_pdf') }}" method="post">
                    <input type="hidden" name="file_path" value={{ cache_key }}">
                    <input type="submit" value="Convert PDF" class="btn">
                </form>
            ''', cache_key = cache_key)
        
            #caching snippet
    cached_file = cache.get(cache_key)
    if cached_file is not None:
        return send_file(cached_file, as_attachment=True)
    
    cache.set(cache_key, pdf_filename, timeout=current_app.config['CACHE_DEFAULT_TIMEOUT'])

    return '''
        <form action="/pdf/upload-pdf" method="post" enctype="multipart/form-data">
            Select PDF to upload:
            <input type="file" name="file">
            <input type="submit" value="Upload PDF">
        </form>
    '''                                                                
        
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

@pdf_blueprint.route('/preview/<filename>')
@cache.memoize()
def preview_pdf(filename):
    pdf_path = os.path.join(current_app.config)
    return send_file()
#TODO ...