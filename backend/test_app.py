import unittest
from main import app

class BasicTests(unittest.TestCase):

    def setUp(self):
        # Set up a test client before each test
        self.app = app.test_client()
        self.app.testing = True

    def test_backend_is_working(self):
        response = self.app.get('/test')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Backend is working', response.data)

    def test_env_variables(self):
        response = self.app.get('/test-env')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['OPENAI_KEY_loaded'])
        self.assertIn('MONGO_URI', data)

    def test_db_connection(self):
        response = self.app.get('/test-db')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'MongoDB connection successful', response.data)

if __name__ == "__main__":
    unittest.main()
