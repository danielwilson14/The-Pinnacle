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
import re
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


# Load environment variables
load_dotenv()

OPENAI_KEY = os.getenv("OPENAI_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")  # Default model
MONGO_URI = os.getenv("MONGO_URI")
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")  # JWT Secret Key
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")  # Your email
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")  # App password or email password
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
        system_message = {
            "role": "system",
            "content": (
                "You are an empathetic and supportive AI assistant on a mental health platform, "
                "designed to provide users with a safe space to express their thoughts and feelings. "
                "Your primary role is to listen actively, acknowledge their emotions, and engage in "
                "compassionate conversations.\n\n"
                
                "**Message Formatting Guidelines:**\n"
                "- **Use short paragraphs** (2-3 sentences max per paragraph) for readability.\n"
                "- **Format responses using markdown:**\n"
                "  - Bold (`**bold**`), italics (`*italics*`), bullet points (`- `), numbered lists (`1. `).\n"
                "- **Use line breaks (`\n`) for new paragraphs.**\n"
                "- Avoid large, uninterrupted blocks of text.\n\n"

                "**Active Listening:** Allow users to share their experiences without interruption. "
                "Use reflective statements to show understanding, such as, 'It sounds like you're going through a challenging time.'\n\n"

                "**Empathetic Engagement:** Respond with empathy and warmth. Example: 'I can understand how that situation could be very stressful.'\n\n"

                "**Non-Judgmental Support:** Maintain a neutral and accepting tone, ensuring users feel safe to share openly without fear of judgment.\n\n"

                "**Guided Assistance:** When appropriate, gently guide users towards available resources, "
                "such as professional help pages, self-assessment tools, or coping strategies, without imposing solutions.\n\n"

                "**User Autonomy:** Empower users by validating their feelings and encouraging them to explore their thoughts and emotions at their own pace.\n\n"

                "**Remember:** Your goal is to create a comforting environment where users feel heard, understood, and supported."
            )
        }

        # Ensure system message is always included at the start of the conversation
        full_conversation = [system_message] + messages

        response = openai.chat.completions.create(
            model=OPENAI_MODEL,
            messages=full_conversation,
            max_tokens=500,  
            temperature=0.7
        )

        return response.choices[0].message.content.strip()  

    except Exception as e:
        print(f"Error in OpenAI API call: {e}")
        return f"Error: {str(e)}"


def is_strong_password(password):
    """Check password strength: Minimum 8 chars, uppercase, lowercase, number, special character."""
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"\W", password):  # Non-alphanumeric
        return False
    return True

def send_verification_email(user_email, token):
    
    if os.getenv("ENV") == "CI":
        print("CI mode: Skipping real email sending.")
        return

    """Send a verification email with a unique token."""
    try:
        verification_link = f"{os.getenv('FRONTEND_URL')}/verify/{token}"
        print(f" Attempting to send verification email to: {user_email}")
        print(f" Verification link: {verification_link}")

        msg = MIMEMultipart()
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = user_email
        msg["Subject"] = "Verify your email"

        body = f"""
        <h3>Verify your email</h3>
        <p>Click the link below to verify your email:</p>
        <a href="{verification_link}">{verification_link}</a>
        <p>If you did not request this, ignore it.</p>
        """
        msg.attach(MIMEText(body, "html"))

        # Using SMTP_SSL for more reliable connection
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, user_email, msg.as_string())

        print(f" Email sent successfully to {user_email}")

    except smtplib.SMTPAuthenticationError:
        print(" SMTP Authentication Error: Check your email/password (Use an App Password if necessary).")
    except smtplib.SMTPConnectError:
        print(" SMTP Connection Error: Gmail might be blocking access.")
    except smtplib.SMTPException as e:
        print(f" SMTP Error: {e}")



@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle user messages, remember context within a session, and save chat to MongoDB."""
    try:
        data = request.json
        user_id = data.get("user_id", "anonymous")
        user_message = data.get("message")
        chat_id = data.get("chat_id")  # Use existing chat_id if provided
        is_new_chat = not chat_id  # If chat_id is not provided, treat it as a new chat

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        conversation_history = [{"role": "system", "content": "You are a helpful assistant."}]

        if not is_new_chat:
            # Fetch existing chat messages to maintain conversation memory
            chat = chats_collection.find_one({"_id": ObjectId(chat_id)})
            if chat:
                conversation_history.extend(chat["messages"])  # Include past messages

        # Add the new user message to the conversation
        conversation_history.append({"role": "user", "content": user_message})

        # Generate assistant's reply based on the full conversation
        assistant_reply = call_openai(conversation_history)

        # Add the assistant’s response to the conversation history
        conversation_history.append({"role": "assistant", "content": assistant_reply})

        if is_new_chat:
            # Create a new chat document in the database
            summary = call_openai([
                {"role": "system", "content": "Summarize this conversation in one sentence."},
                {"role": "user", "content": user_message},
                {"role": "assistant", "content": assistant_reply},
            ])
            chat_doc = {
                "user_id": user_id,
                "chat_name": summary or "Untitled Chat",
                "messages": conversation_history[1:],  # Exclude system prompt
                "summary": summary,
                "created_at": datetime.datetime.utcnow(),
            }
            result = chats_collection.insert_one(chat_doc)
            return jsonify({
                "assistant_reply": assistant_reply,
                "chat_id": str(result.inserted_id)
            }), 200
        else:
            # Update existing chat by appending the new conversation data
            chats_collection.update_one(
                {"_id": ObjectId(chat_id)},
                {"$set": {"messages": conversation_history[1:]}}  # Exclude system prompt
            )

            return jsonify({"assistant_reply": assistant_reply, "chat_id": chat_id}), 200

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

        # Debugging log to confirm user_id
        print(f"Fetching chats for user_id: {user_id}")

        # Fetch chats for the user
        chats = chats_collection.find({"user_id": user_id}, {"messages": 0})  # Exclude full messages for performance

        # Debugging log to confirm fetched chats
        chat_list = [
            {
                "_id": str(chat["_id"]),
                "chat_name": chat.get("chat_name", "Untitled"),
                "summary": chat.get("summary", ""),
                "isFavourited": chat.get("isFavourited", False) 

            }
            for chat in chats
        ]
        print(f"Fetched chat list: {chat_list}")

        return jsonify(chat_list), 200
    except Exception as e:
        print(f"Error in /api/chats: {e}")  # Detailed error logging
        return jsonify({"error": "Internal server error"}), 500
    
@app.route('/api/chats/<chat_id>', methods=['DELETE'])
def delete_chat(chat_id):
    """Delete a specific chat by ID."""
    try:
        chat = chats_collection.find_one({"_id": ObjectId(chat_id)})
        if not chat:
            return jsonify({"error": "Chat not found"}), 404

        chats_collection.delete_one({"_id": ObjectId(chat_id)})
        return jsonify({"message": "Chat deleted successfully"}), 200
    except Exception as e:
        print(f"Error in /api/chats/<chat_id>: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/calendar', methods=['GET'])
def get_calendar_chats():
    """
    Fetch all dates when a user had chats, along with chat summaries for each date.
    """
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Debugging log to confirm user_id
        print(f"Fetching calendar data for user_id: {user_id}")

        # Fetch chats for the user, include created_at and summary fields
        chats = chats_collection.find(
            {"user_id": user_id},
            {"created_at": 1, "summary": 1}
        )

        # Create a dictionary to group chats by date
        calendar_data = {}
        for chat in chats:
            chat_date = chat["created_at"].date()  # Get the date part
            chat_date_str = chat_date.isoformat()  # Convert to string for JSON

            if chat_date_str not in calendar_data:
                calendar_data[chat_date_str] = []

            calendar_data[chat_date_str].append({
                "_id": str(chat["_id"]),
                "summary": chat.get("summary", "No summary available"),
            })

        # Debugging log for calendar data
        print(f"Fetched calendar data: {calendar_data}")

        return jsonify(calendar_data), 200
    except Exception as e:
        print(f"Error in /api/calendar: {e}")  # Detailed error logging
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/chats/<chat_id>', methods=['GET'])
def get_chat(chat_id):
    """Fetch a specific chat by ID."""
    try:
        chat = chats_collection.find_one({"_id": ObjectId(chat_id)})
        if not chat:
            return jsonify({"error": "Chat not found"}), 404

        # Convert ObjectId to string for the frontend
        chat["_id"] = str(chat["_id"])

        return jsonify(chat), 200
    except Exception as e:
        print(f"Error in /api/chats/<chat_id>: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user with hashed password and send a verification email."""
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        if not is_strong_password(password):
            return jsonify({"error": "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"error": "User already exists"}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        verification_token = str(ObjectId())

        user = {
            "email": email,
            "password": hashed_password,
            "verified": False,  # New users are unverified
            "verification_token": verification_token,
            "created_at": datetime.datetime.utcnow()
        }
        user_id = users_collection.insert_one(user).inserted_id

        print(f" User registered: {email}")
        print(f" Calling send_verification_email with token: {verification_token}")

        # Call the function
        send_verification_email(email, verification_token)

        return jsonify({
            "message": "Registration successful! Please verify your email.",
            "user_id": str(user_id)
        }), 201
    except Exception as e:
        print(f" Error in /api/register: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500



@app.route('/api/verify-email/<token>', methods=['GET'])
def verify_email(token):
    try:
        user = users_collection.find_one({"verification_token": token})
        if not user:
            return jsonify({"error": "Invalid or expired token"}), 400

        users_collection.update_one({"_id": user["_id"]}, {"$set": {"verified": True}, "$unset": {"verification_token": ""}})
        return jsonify({"message": "Email verified successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


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
            "user_id": str(user["_id"]),
            "verified": user.get("verified", False)
            
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

@app.route('/api/user', methods=['GET'])
def get_user():
    """Fetch user profile information."""
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Return user data (excluding password for security)
        return jsonify({
            "display_name": user.get("display_name", ""),
            "email": user["email"],
            "profile_pic": user.get("profile_pic", ""),
            "dob": user.get("dob", ""),
            "location": user.get("location", ""),
            "pronouns": user.get("pronouns", ""),
            "created_at": user["created_at"].isoformat()
        }), 200
    except Exception as e:
        print(f"Error in /api/user: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/user/update', methods=['POST'])
def update_user():
    """Update user profile information."""
    try:
        data = request.json
        user_id = data.get("user_id")

        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        update_fields = {
            "display_name": data.get("display_name", ""),
            "profile_pic": data.get("profile_pic", ""),
            "dob": data.get("dob", ""),
            "location": data.get("location", ""),
            "pronouns": data.get("pronouns", "")
        }

        users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})

        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        print(f"Error in /api/user/update: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/user/delete', methods=['DELETE'])
def delete_user():
    """Delete a user account and all associated data."""
    try:
        data = request.json
        user_id = data.get("user_id")

        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Ensure user exists before deletion
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Delete all chats associated with this user
        chats_collection.delete_many({"user_id": user_id})

        # Delete user from database
        users_collection.delete_one({"_id": ObjectId(user_id)})

        return jsonify({"message": "Account and associated data deleted successfully"}), 200

    except Exception as e:
        print(f"Error in /api/user/delete: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/favourites/toggle', methods=['POST'])
def toggle_favourite():
    """Toggle a chat as a favourite or unfavourite."""
    try:
        data = request.json
        chat_id = data.get("chat_id")
        if not chat_id:
            return jsonify({"error": "Chat ID is required"}), 400

        chat = chats_collection.find_one({"_id": ObjectId(chat_id)})
        if not chat:
            return jsonify({"error": "Chat not found"}), 404

        # Toggle favourite field
        new_fav_status = not chat.get("isFavourited", False)
        chats_collection.update_one({"_id": ObjectId(chat_id)}, {"$set": {"isFavourited": new_fav_status}})

        return jsonify({"message": "Favourite status updated", "isFavourited": new_fav_status}), 200
    except Exception as e:
        print(f"Error in /api/favourites/toggle: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/favourites', methods=['GET'])
def get_favourites():
    """Get all favourited chats for a user."""
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        favourite_chats = chats_collection.find({"user_id": user_id, "isFavourited": True}, {"messages": 0})

        chat_list = [
            {
                "_id": str(chat["_id"]),
                "chat_name": chat.get("chat_name", "Untitled"),
                "summary": chat.get("summary", ""),
            }
            for chat in favourite_chats
        ]

        return jsonify(chat_list), 200
    except Exception as e:
        print(f"Error in /api/favourites: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/user/change-password', methods=['POST'])
def change_password():
    """Allow users to change their password."""
    try:
        data = request.json
        user_id = data.get("user_id")
        old_password = data.get("old_password")
        new_password = data.get("new_password")

        if not user_id or not old_password or not new_password:
            return jsonify({"error": "All fields are required"}), 400

        # Fetch user from DB
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Check if old password is correct
        if not bcrypt.checkpw(old_password.encode('utf-8'), user["password"]):
            return jsonify({"error": "Incorrect old password"}), 401

        # Check if new password is strong
        if not is_strong_password(new_password):
            return jsonify({"error": "Password must be at least 8 characters with uppercase, lowercase, number, and special character."}), 400

        # Hash and update new password
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password": hashed_password}}
        )

        return jsonify({"message": "Password changed successfully"}), 200

    except Exception as e:
        print(f"Error in /api/user/change-password: {e}")
        return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

