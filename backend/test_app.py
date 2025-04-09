import os
os.environ["MONGO_URI"] = "mongodb://localhost:27017/test"

import unittest
from backend.main import app, users_collection, chats_collection
from bson.objectid import ObjectId

class BasicTests(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

        # Clean test data
        users_collection.delete_many({"email": "testuser@example.com"})
        chats_collection.delete_many({"user_id": "test_user_id"})

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

    def test_register_and_login(self):
        email = "testuser@example.com"
        password = "StrongPass123!"

        response = self.app.post('/api/register', json={
            "email": email,
            "password": password
        })
        self.assertEqual(response.status_code, 201)

        response = self.app.post('/api/login', json={
            "email": email,
            "password": password
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("token", data)
        self.assertEqual(data["verified"], False)

    def test_chat_flow(self):
        user_id = "test_user_id"
        message = "I'm feeling really overwhelmed today."

        response = self.app.post('/api/chat', json={
            "user_id": user_id,
            "message": message
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("assistant_reply", data)
        self.assertIn("chat_id", data)

        chat_id = data["chat_id"]

        get_response = self.app.get(f'/api/chats/{chat_id}')
        self.assertEqual(get_response.status_code, 200)
        self.assertIn("messages", get_response.get_json())

        delete_response = self.app.delete(f'/api/chats/{chat_id}')
        self.assertEqual(delete_response.status_code, 200)
        self.assertIn(b'Chat deleted successfully', delete_response.data)

if __name__ == "__main__":
    unittest.main()
