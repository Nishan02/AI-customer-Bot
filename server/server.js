// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Allow ANYONE to access (Easiest for testing)
    // OR
    origin: ['http://localhost:5173', 'https://ai-customer-bot.onrender.com/'], // Allow specific domains
    credentials: true
}));

app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Make it available
app.locals.groq = groq;

// Test endpoint
app.get("/", (req, res) => {
  res.send("Groq AI Support Bot API Running");
});

// Routes
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Groq-powered server running on port ${PORT}`)
);
