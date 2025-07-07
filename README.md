# 📝 Note-Taking App – Full Stack

A modern full-stack note-taking application that allows users to securely sign up or log in using Email + OTP or Google authentication, create and delete personal notes, and enjoy a clean, mobile-friendly UI.

---

## 🌐 Live Demo

- 🔗 **Frontend**: [https://your-frontend-url.vercel.app](https://your-frontend-url.vercel.app)
- 🔗 **Backend API**: [https://your-backend-url.onrender.com](https://your-backend-url.onrender.com)

> Replace the URLs above with your actual deployed links.

---

## 📁 Folder Structure

note-taking-app/
├── backend/ → Express.js backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ ├── .env.example
│ └── ...
├── client/ → React.js frontend
│ ├── src/
│ ├── public/
│ └── ...
├── .gitignore
└── README.md → Project documentation

## 🚀 Features

### 🔐 Authentication
- Sign up using Email + OTP
- Google OAuth login option
- Secure JWT token management
- Input validation and error messages

### 🗒️ Notes
- Create personal notes after login
- Delete notes securely
- Notes linked to user accounts

### 🧑‍💻 User Experience
- Fully responsive, mobile-friendly UI
- Clean, modern design with intuitive flow
- Real-time feedback and validations

---

## 🧑‍💻 Tech Stack

### 🔧 Backend
- **Node.js** + **Express.js**
- **MongoDB** (can be swapped with MySQL/PostgreSQL)
- **JWT** for authorization
- **Google OAuth**
- **Nodemailer** for OTP via Email

### 🎨 Frontend
- **React.js**
- **React Router**
- **Custom CSS** or **Tailwind CSS**
- Responsive Layout

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/belikecoder/Notes.git
cd Notes
🔧 Backend Setup
bash
Copy
Edit
cd backend
npm install
🛠️ Create .env file
Copy .env.example and rename it to .env, then add your values:

env
Copy
Edit
EMAIL=your-email@gmail.com
EMAIL_PASS=your-app-password
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
▶️ Start Backend
bash
Copy
Edit
npm start
Runs at http://localhost:5000

💻 Frontend Setup
bash
Copy
Edit
cd client
npm install
🔐 Optional .env for frontend
Create client/.env file (if needed):

env
Copy
Edit
REACT_APP_API_URL=http://localhost:5000
▶️ Start Frontend
bash
Copy
Edit
npm start
Runs at http://localhost:3000

☁️ Deployment
Backend
Deploy to Render or Railway

Make sure environment variables are added in the deploy platform

Enable CORS for frontend requests

Frontend
Deploy to Vercel or Netlify

Set REACT_APP_API_URL to your deployed backend URL

🛡️ .gitignore Example
gitignore
Copy
Edit
# Backend
backend/node_modules/
backend/.env

# Frontend
client/node_modules/
client/.env
client/build/

# Logs
*.log
📄 License
This project is licensed under the MIT License.

🤝 Contributing
Pull requests and suggestions are welcome. Feel free to fork this repository and enhance the project.