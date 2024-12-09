from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS  # Import CORS
from bson import ObjectId
import os
from dotenv import load_dotenv
import openai  # Import the OpenAI module

# Load environment variables
load_dotenv()

# Initialize OpenAI client
OPENAI_KEY = os.getenv("OPENAI_KEY")
ORG_ID = os.getenv("ORG_ID")
OPENAI_4O = os.getenv("OPENAI_4O")

# Set OpenAI API key and organization
openai.api_key = OPENAI_KEY
openai.organization = ORG_ID
message_array = []

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB setup
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

users = mongo.db.users
chats = mongo.db.chats
settings = mongo.db.settings

def api_call(message_array):
    print("Message array:", message_array)
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",  # Use the correct model name
            messages=message_array
        )
        result = response.choices[0].message['content']
        return result
    except Exception as e:
        print("Error in API call:", e)
        return "Error in processing your request. Please try again later."

# Define the chat endpoint
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("message")

    # Add user message to the message array
    message_array.append({"role": "user", "content": user_message})

    # Call the API
    response = api_call(message_array)

    # Add assistant's response to the message array
    if response:
        message_array.append({"role": "assistant", "content": response})

    # Return the response to the frontend
    return jsonify({"response": response})


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    existing_user = users.find_one({"email": data['email']})
    if existing_user:
        return jsonify({"error": "User already exists"}), 400
    user_id = users.insert_one({
        "email": data['email'],
        "password": data['password'],  # Hash this in production
        "favourites": [],
        "settings": {},
    }).inserted_id
    return jsonify({"message": "User registered", "user_id": str(user_id)})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = users.find_one({"email": data['email'], "password": data['password']})
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"message": "Login successful", "user_id": str(user['_id'])})

@app.route('/api/save-chat', methods=['POST'])
def save_chat():
    data = request.json
    chat_id = chats.insert_one({
        "user_id": data['user_id'],
        "messages": data['messages'],
        "date": data['date']
    }).inserted_id
    return jsonify({"message": "Chat saved", "chat_id": str(chat_id)})

@app.route('/api/get-chats-by-date', methods=['GET'])
def get_chats_by_date():
    user_id = request.args.get('user_id')
    date = request.args.get('date')
    user_chats = list(chats.find({"user_id": user_id, "date": date}))
    for chat in user_chats:
        chat['_id'] = str(chat['_id'])  # Convert ObjectId to string
    return jsonify({"chats": user_chats})

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5000)
