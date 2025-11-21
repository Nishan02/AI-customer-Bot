import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function listModels() {
  try {
    const models = await groq.models.list();
    console.log("Available Groq Models:");
    models.data.forEach((m) => console.log(" -", m.id));
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
