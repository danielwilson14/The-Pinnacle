import os
from flask import Flask, request, jsonify
from flask_cors import CORS 
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
OPENAI_KEY = os.getenv("OPENAI_KEY")
ORG_ID = os.getenv("ORG_ID")
OPENAI_4O = os.getenv("OPENAI_4O")

CLIENT = OpenAI(api_key=OPENAI_KEY, organization=ORG_ID)
message_array = []

# Initialize Flask app
app = Flask(__name__)
CORS(app)

def api_call(message_array):
    print("Message array:", message_array)
    response = CLIENT.chat.completions.create(
        model=OPENAI_4O,
        messages=message_array
    )
    result = response.choices[0].message.content
    return result

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

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5000)
