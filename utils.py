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

def is_pdf_size_valid(pdf_path, max_width_cm = 20, max_height_cm = 20):
    width_cm, height_cm = get_pdf_size_with_pymupdf(pdf_path)
    return width_cm <= max_width_cm and height_cm <= max_height_cm