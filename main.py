import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

OPENAI_KEY = os.getenv("OPENAI_KEY")
ORG_ID = os.getenv("ORG_ID")
OPENAI_4O = os.getenv("OPENAI_4O")

CLIENT = OpenAI(api_key=OPENAI_KEY,organization=ORG_ID)
message_array = []

def api_call(message_array):

    print(message_array)
    response = CLIENT.chat.completions.create(
        model = OPENAI_4O,
        messages=message_array
    )
    result = response.choices[0].message.content
    return result

def chat_bot():
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("Bot: Goodbye!")
            break

        message_array.append({"role": "user", "content": user_input})

        response = api_call(message_array)
        if response:
            message_array.append({"role": "assistant", "content": response})
            print("Bot:", response)

if __name__ == "__main__":
    chat_bot()
