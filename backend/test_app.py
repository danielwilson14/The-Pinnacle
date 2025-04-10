import os
os.environ["ENV"] = "CI"
os.environ["MONGO_URI"] = "mongodb://localhost:27017/test"
os.environ["OPENAI_KEY"] = "fake-key"
os.environ["SECRET_KEY"] = "supersecretkey"

import unittest
from unittest.mock import patch
from backend.main import app, mongo
from bson.objectid import ObjectId

class BackendTests(unittest.TestCase):

    def setUp(self):
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

    @patch("backend.main.call_openai", return_value="This is a test summary.")
    def test_register_and_login(self, mock_openai):
        # Register user
        email = f"testuser_{ObjectId()}@example.com"
        password = "Password1!"
        reg = self.app.post('/api/register', json={"email": email, "password": password})
        self.assertEqual(reg.status_code, 201)
        reg_data = reg.get_json()
        self.assertIn("user_id", reg_data)

        # Manually verify user in DB for login
        user_id = reg_data["user_id"]
        mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"verified": True}})

        # Login user
        login = self.app.post('/api/login', json={"email": email, "password": password})
        self.assertEqual(login.status_code, 200)
        login_data = login.get_json()
        self.assertIn("token", login_data)
        self.user_id = user_id
        self.token = login_data["token"]

    @patch("backend.main.call_openai", return_value="This is a test summary.")
    def test_update_profile(self, mock_openai):
        self.test_register_and_login()
        update = self.app.post('/api/user/update', json={
            "user_id": self.user_id,
            "display_name": "Test User",
            "dob": "2000-01-01",
            "location": "Nowhere",
            "pronouns": "they/them",
            "profile_pic": "test.jpg"
        })
        self.assertEqual(update.status_code, 200)

    @patch("backend.main.call_openai", return_value="This is a test summary.")
    def test_create_chat_and_toggle_favourite(self, mock_openai):
        self.test_register_and_login()

        # Send a test chat message
        chat = self.app.post('/api/chat', json={
            "user_id": self.user_id,
            "message": "Hello there!"
        })
        self.assertEqual(chat.status_code, 200)
        chat_id = chat.get_json()["chat_id"]

        # Toggle favourite
        fav = self.app.post('/api/favourites/toggle', json={"chat_id": chat_id})
        self.assertEqual(fav.status_code, 200)
        self.assertIn("isFavourited", fav.get_json())

    @patch("backend.main.call_openai", return_value="This is a test summary.")
    def test_get_favourites(self, mock_openai):
        self.test_create_chat_and_toggle_favourite()
        response = self.app.get(f'/api/favourites?user_id={self.user_id}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)

    @patch("backend.main.call_openai", return_value="This is a test summary.")
    def test_calendar_view(self, mock_openai):
        self.test_create_chat_and_toggle_favourite()
        response = self.app.get(f'/api/calendar?user_id={self.user_id}')
        self.assertEqual(response.status_code, 200)
        calendar = response.get_json()
        self.assertIsInstance(calendar, dict)

    @patch("backend.main.call_openai", return_value="This is a test summary.")
    def test_change_password(self, mock_openai):
        self.test_register_and_login()
        new_pass = self.app.post('/api/user/change-password', json={
            "user_id": self.user_id,
            "old_password": "Password1!",
            "new_password": "NewPass123!"
        })
        self.assertEqual(new_pass.status_code, 200)
        self.assertIn("Password changed successfully", new_pass.get_data(as_text=True))

if __name__ == "__main__":
    unittest.main()
