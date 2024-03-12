import unittest
import os
from app import app

class AppTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_home_route(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('PDF to G-code Conversion Service', response.get_json()['message'])

    def test_upload_pdf_route_no_file(self):
        response = self.app.post('/upload-pdf')
        self.assertEqual(response.status_code, 400)
        self.assertIn('No file part', response.get_json()['error'])

    def test_upload_pdf_route_file_upload(self):
        test_pdf_path = 'path/to/a/test/pdf/file.pdf'
        with open(test_pdf_path, 'rb') as test_pdf:
            data = {
                'file': (test_pdf, os.path.basename(test_pdf_path))
            }
            response = self.app.post('/upload-pdf', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()