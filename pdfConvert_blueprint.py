from flask import Flask, Blueprint, jsonify, render_template_string, send_file, request
import tempfile
import os
import subprocess
from utils import allowed_file, is_pdf_size_valid

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
                os.remove(temp_pdf.name)
                return jsonify({"error": "PDF page size exceeds 20cm x 20cm"}), 400
            return render_template_string('''
                Uploaded successfully! <br>
                <form action="{{ url_for('pdf_blueprint.convert_pdf') }}" method="post">
                    <input type="hidden" name="file_path" value={{ temp_pdf_name }}">
                    <input type="submit" value="Convert PDF" class="btn">
                </form>
            ''', temp_pdf_name = temp_pdf.name)

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
