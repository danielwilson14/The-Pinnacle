# Kiva AI 🧠💬  
*A personal project with a shared purpose – to help those who feel they have no one to turn to.*

Kiva AI is a full-stack mental health chatbot application designed to provide a calm, safe, and judgment-free space for users to talk about their thoughts and feelings. Built with the MERN stack and OpenAI’s GPT-3.5 Turbo model, the system supports open-ended conversation, favourites, usage tracking, and ethical guidance.

---

## 🔧 Tech Stack

- **Frontend**: React (Create React App)
- **Backend**: Flask (Python) with REST API
- **Database**: MongoDB Atlas (cloud-hosted)
- **AI Integration**: OpenAI GPT-3.5 Turbo
- **Containerisation**: Docker & Docker Compose
- **Email Service**: Gmail SMTP (for verification)

---

## ✅ Features

- 💬 Free-form chatbot conversations with GPT  
- ⭐ Favourite important conversations for reflection  
- 📅 Calendar usage tracker  
- 🌙 Light and dark mode toggle  
- 🚑 “Professional Help” page linking to real support  
- 🐳 Fully containerised architecture  
- 🔐 Privacy-focused (no personal data collected)  

---

## 🚀 Getting Started

### 1. Clone the Repository

git clone https://github.com/yourusername/kiva-ai.git cd kiva-ai

mathematica
Copy
Edit

### 2. Set Up Environment Variables

Create a `.env` file in the `backend/` folder with:

OPENAI_MODEL=gpt-3.5-turbo OPENAI_KEY=your_openai_api_key MONGO_URI=your_mongodb_connection_string SECRET_KEY=your_secret_key

EMAIL_ADDRESS=your_email@gmail.com EMAIL_PASSWORD=your_email_password

FRONTEND_URL=http://localhost:3000

mathematica
Copy
Edit

(Optional) For frontend, if needed:

REACT_APP_API_URL=http://localhost:5000

yaml
Copy
Edit

---

### 3. Run with Docker

Ensure Docker and Docker Compose are installed, then run:

docker-compose up --build

yaml
Copy
Edit

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000

---

## 🧱 Architecture

Kiva AI uses a modular containerised architecture:

[ React Frontend ] ←→ [ Flask Backend ] ←→ [ MongoDB Atlas ] | | | Docker Docker Docker

yaml
Copy
Edit

Frontend communicates with the backend via REST. The backend integrates with OpenAI’s GPT-3.5 Turbo and stores all conversation data in MongoDB.

---

## 🗂️ Folder Structure

kiva-ai/ ├── client/ # React frontend ├── backend/ # Flask backend (API, OpenAI, MongoDB) ├── docker-compose.yml # Multi-container config └── README.md # Project overview and instructions

yaml
Copy
Edit

---

## ⚠️ Security Notes

- Do **not** commit real `.env` values to version control.  
- Use a `.env.example` file to show structure without secrets.  
- Rotate your API keys before public sharing.  

---

## 📄 License

This project was created as part of a final-year Computer Science dissertation. It is intended for educational use only and not for clinical deployment or emergency situations.

---