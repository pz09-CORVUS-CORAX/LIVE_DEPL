from datetime import datetime, timedelta
import fitz
import os

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() == 'pdf'

def get_pdf_size_with_pymupdf(pdf_path):
    doc = fitz.open(pdf_path)
    page = doc.load_page(0)
    width_cm = (page.rect.width / 72) * 2.54
    height_cm = (page.rect.height / 72) * 2.54
    doc.close()
    return width_cm, height_cm

def is_pdf_size_valid(pdf_path, max_width_cm = 50, max_height_cm = 50):
    width_cm, height_cm = get_pdf_size_with_pymupdf(pdf_path)
    return width_cm <= max_width_cm and height_cm <= max_height_cm

# Global dictionary to track file usage
temp_file_tracking = {}

def cleanup_temp_pdfs():
    print("Inside cleanup function")
    temp_dir = 'static/temporaries' # Replace with your actual directory
    expiration_time = datetime.now() - timedelta(minutes=60)  # 1 minute ago
    
    for filename in os.listdir(temp_dir):
        if filename.endswith('.pdf'):
            file_path = os.path.join(temp_dir, filename)
            if datetime.fromtimestamp(os.path.getmtime(file_path)) < expiration_time:
                os.remove(file_path)
                print(f"Deleted temporary PDF: {filename}")
