from flask import Flask, render_template_string
from pdfConvert_blueprint import pdf_blueprint

app = Flask(__name__)
app.register_blueprint(pdf_blueprint, url_prefix='/pdf')

@app.route('/')
def home():
    return render_template_string('''
        <h1>Konwerter PDF na Gcode</h1>
        <a href="/pdf/upload-pdf" class="btn">Upload PDF</a>
        <style>
            btn {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px
            }
        </style>
    ''')

if __name__ == '__main__':
    app.run(debug=True) 
