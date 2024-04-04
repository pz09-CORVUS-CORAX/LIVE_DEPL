from flask import Flask, render_template_string
from flask_caching import Cache
from pdfConvert_blueprint import pdf_blueprint
import fitz

def create_app():
    app = Flask(__name__)

    #Konfiguracja cache'u
    app.config['CACHE_TYPE'] = 'simple'
    app.config['CACHE_DEFAULT_TIMEOUT'] = 300
    # cache = Cache(app)

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
    return app

# Tworzymy instancje dla aplikacji
app = create_app()

if __name__ == '__main__':
    app.run(debug=True) 
