from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId
import datetime
import bcrypt
import jwt
from flask_jwt_extended import create_access_token, jwt_required, JWTManager

# Load environment variables
load_dotenv()

OPENAI_KEY = os.getenv("OPENAI_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")  # Default model
MONGO_URI = os.getenv("MONGO_URI")
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")  # JWT Secret Key

# Configure OpenAI
openai.api_key = OPENAI_KEY

# Initialize Flask
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configure MongoDB
app.config["MONGO_URI"] = MONGO_URI
app.config["JWT_SECRET_KEY"] = SECRET_KEY  # Set JWT Secret Key
mongo = PyMongo(app)
jwt = JWTManager(app)

users_collection = mongo.db.users
chats_collection = mongo.db.chats


def call_openai(messages):
    try:
        # Call OpenAI API using the updated syntax and correct method
        response = openai.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            max_tokens=150
        )
        # Extract and return the assistant's reply
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error in OpenAI API call: {e}")
        return f"Error: {str(e)}"





@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle user messages and save chat to MongoDB."""
    try:
        data = request.json
        user_id = data.get("user_id", "anonymous")
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Validate that the user_id exists in the users collection
        if user_id != "anonymous":  # Skip validation for anonymous users
            try:
                user_obj_id = ObjectId(user_id)
                if not users_collection.find_one({"_id": user_obj_id}):
                    return jsonify({"error": "Invalid user ID"}), 400
            except Exception:
                return jsonify({"error": "Invalid user ID format"}), 400
        
        user_message = data.get("message")
        is_new_chat = data.get("is_new_chat", True)

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        # Generate OpenAI response
        assistant_reply = call_openai([
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_message}
        ])

        # If it's a new chat, create a new document
        if is_new_chat:
            summary = call_openai([
                {"role": "system", "content": "Summarize this conversation in one sentence."},
                {"role": "user", "content": user_message},
                {"role": "assistant", "content": assistant_reply}
            ])
            chat_doc = {
                "user_id": user_id,
                "chat_name": summary or "Untitled Chat",
                "messages": [
                    {"role": "user", "content": user_message},
                    {"role": "assistant", "content": assistant_reply}
                ],
                "summary": summary,
                "created_at": datetime.datetime.utcnow()
            }
            result = chats_collection.insert_one(chat_doc)
            return jsonify({"assistant_reply": assistant_reply, "chat_id": str(result.inserted_id)}), 200

        # If it's an existing chat, append to the existing document
        chat_id = data.get("chat_id")
        if not chat_id:
            return jsonify({"error": "Chat ID is required for existing chats"}), 400

        chats_collection.update_one(
            {"_id": ObjectId(chat_id)},
            {"$push": {"messages": {"role": "user", "content": user_message}}},
        )
        return jsonify({"assistant_reply": assistant_reply}), 200

    except Exception as e:
        print(f"Error in /api/chat: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/chats', methods=['GET'])
def get_chats():
    """Fetch all chats for a user."""
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Fetch chats for the user
        chats = chats_collection.find({"user_id": user_id}, {"messages": 0})  # Exclude full messages for performance
        chat_list = [{"_id": str(chat["_id"]), "chat_name": chat["chat_name"], "summary": chat["summary"]} for chat in chats]

        return jsonify(chat_list), 200
    except Exception as e:
        print(f"Error in /api/chats: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user with hashed password."""
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Check if user already exists
        if users_collection.find_one({"email": email}):
            return jsonify({"error": "User already exists"}), 400

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Insert user into database
        user = {
            "email": email,
            "password": hashed_password,
            "created_at": datetime.datetime.utcnow()
        }
        user_id = users_collection.insert_one(user).inserted_id

        return jsonify({"message": "User registered", "user_id": str(user_id)}), 201
    except Exception as e:
        print(f"Error in /api/register: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Authenticate user and return JWT token."""
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        # Find user by email
        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user["password"]):
            return jsonify({"error": "Invalid credentials"}), 401

        # Create JWT token
        access_token = create_access_token(identity=str(user["_id"]))

        return jsonify({
            "message": "Login successful",
            "token": access_token,
            "user_id": str(user["_id"])
        }), 200
    except Exception as e:
        print(f"Error in /api/login: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    
@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    """Test protected route."""
    return jsonify({"message": "You have access to this protected route!"}), 200


@app.route('/test-db', methods=['GET'])
def test_db():
    """Verify MongoDB connection."""
    try:
        mongo.db.command("ping")
        return jsonify({"message": "MongoDB connection successful!"}), 200
    except Exception as e:
        print(f"Error testing DB connection: {str(e)}")  # Debugging log
        return jsonify({"error": str(e)}), 500


@app.route('/test-env', methods=['GET'])
def test_env():
    """Check if environment variables are loaded."""
    return jsonify({
        "OPENAI_KEY_loaded": bool(OPENAI_KEY),
        "OPENAI_MODEL": OPENAI_MODEL,
        "MONGO_URI": MONGO_URI,
    }), 200


@app.route('/test', methods=['GET'])
def test():
    return {"message": "Backend is working!"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
