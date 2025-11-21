# 🤖 AI Customer Support Bot – Unthinkable Solutions

A full-stack MERN application that simulates an intelligent AI customer support agent for **Unthinkable Solutions**. The bot handles FAQs, retains conversational context, and simulates **human escalation** when it cannot confidently answer a query.

---
## 🎯 Project Objectives

**Problem Statement:** Simulate a real-world customer support interaction where an AI handles routine queries (FAQs) but intelligently recognizes when to hand off to a human agent.

**Solution:** This project implements:
- ✅ **FAQ-driven responses** using a curated dataset specific to Unthinkable Solutions.
- ✅ **Contextual memory**, allowing the bot to remember previous messages in the session.
- ✅ **Escalation simulation**; if a query is outside the FAQ scope, the bot politely initiates a handoff.
- ✅ **Conversation Summarization** endpoint for agent handovers.

---

## ✨ Features

### Core Functionality
1.  **FAQ Intelligence** The bot prioritizes answers from a fixed FAQ list (e.g., Support Hours, Password Reset, Delivery Times).
2.  **Contextual Memory (Session Management)** Every user gets a unique `sessionId`. The backend feeds the last ~10 messages to the LLM, allowing for follow-up questions (e.g., *"And does that apply to weekends too?"*).
3.  **Escalation Logic** For complex queries not covered by FAQs, the bot avoids hallucinating and responds:  
    > *"I'm not sure about this one. Would you like me to connect you with customer care?"* It then flags the session status as `needs-human` in the database.
4.  **Conversation Summary API** Generates a bullet-point summary of the chat and suggests "Next Actions" for human agents.

### UI/UX (Frontend)
* Mobile-style "Phone" card interface with Glassmorphism design.
* Dynamic typing indicators.
* Auto-scrolling and distinct styling for User vs. Bot messages.

---

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React + Vite, Axios, CSS (Glassmorphism) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **AI/LLM** | Groq API (Model: LLaMA 3.3-70B) |
| **Utilities** | dotenv, nodemon, crypto (for session IDs) |

---

## 🚀 Setup & Installation
### 1. Prerequisites
- Node.js (v18+)

- MongoDB (Local or Atlas URI)

- Groq API Key (Get one at console.groq.com)
  
### 2. Create a .env file in the server/ directory:

- PORT=5000
- MONGO_URI=mongodb+srv://<your_connection_string>
- GROQ_API_KEY=gsk_your_key_here

### 3. Backend Setup
```

cd server
npm install
npm run dev 
```
### 4. Frontend Setup
```
cd client
npm install
npm run dev
```
---
## 👤 Author
### Nishan Raj Regmi
###  - B.Tech Computer Science & Engineering 
### - Motilal Nehru National Institute of Technology Allahabad
