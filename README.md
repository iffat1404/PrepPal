# 🤖 PrepPal – Your Personal AI Interview Partner

**PrepPal** is a full-stack AI-powered web application designed to simulate real-world technical interviews. It helps users prepare effectively by generating custom interview questions, evaluating responses with Google Gemini AI, and offering personalized, actionable feedback.

---

## ✨ About The Project

Technical interviews can be intimidating. PrepPal bridges the gap between theory and real-world experience by providing a platform where you can:

- Practice interviews in a realistic, pressure-free environment.
- Receive instant AI-driven feedback and analysis.
- Track progress over time and build confidence.

---

## 🚀 Features

- 🎯 **Custom Interview Sessions**: Choose topics, difficulty level, and number of questions.
- 🗣️ **Speech-to-Text Input**: Answer questions verbally, with auto-transcription.
- 🤖 **AI Feedback & Scoring**: Gemini AI evaluates answers with detailed insights:
  - Overall score
  - Strengths and weaknesses
  - Question-wise breakdown
- 📊 **User Dashboard**: Track recent interviews and performance metrics.
- 🧠 **Interview History**: View, review, or delete any past interview session.
- 🔒 **Authentication**: Secure login with JWT (HTTP-only cookie) and Google OAuth.
- 🌙 **Dark Theme UI**: Fully responsive, mobile-friendly dark mode design.

---

## 🛠️ Tech Stack

| Layer       | Technology                            |
|-------------|----------------------------------------|
| **Frontend**| React, Tailwind CSS, Vite              |
| **Backend** | Node.js, Express.js                    |
| **Database**| MongoDB (local or MongoDB Atlas)       |
| **AI API**  | Google Gemini API                      |
| **Auth**    | JWT, Google OAuth                      |

---

## 📡 API Endpoints Overview

> All protected endpoints require a valid JWT token (stored in HTTP-only cookies).

### 🔐 Authentication – `/api/auth`

| Method | Endpoint     | Description             |
|--------|--------------|-------------------------|
| POST   | `/signup`    | Register new user       |
| POST   | `/login`     | Log in existing user    |
| POST   | `/logout`    | Log out user            |
| GET    | `/me`        | Get user profile        |

### 👤 User Data – `/api/user`

| Method | Endpoint        | Description                      |
|--------|------------------|----------------------------------|
| GET    | `/dashboard`     | Fetch dashboard stats            |
| GET    | `/sessions`      | Get all interview sessions       |
| DELETE | `/account`       | Delete user and all data         |

### 🧪 Interview System – `/api/interview`

| Method | Endpoint                   | Description                            |
|--------|-----------------------------|----------------------------------------|
| POST   | `/generate`                 | Start a new interview session          |
| POST   | `/submit-answer`           | Submit response to a question          |
| GET    | `/session/:sessionId`      | Fetch session and question details     |
| GET    | `/summary/:sessionId`      | Get AI-generated feedback summary      |
| DELETE | `/session/:sessionId`      | Delete a specific interview session    |

---

## 🧰 Getting Started

### ✅ Prerequisites

- Node.js (v18+)
- npm
- MongoDB (local or Atlas)
- Google Cloud Console credentials (for OAuth + Gemini)

---

👩‍💻 Author
Made with ❤️ by Iffat Patel