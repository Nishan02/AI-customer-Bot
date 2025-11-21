import express from "express";
import crypto from "crypto";
import Session from "../models/session.js";

const router = express.Router();

// FAQ list
const FAQS = [
  {
    question: "What are your support hours?",
    answer: "Our support is available 24/7 via chat and email.",
  },
  {
    question: "How can I reset my password?",
    answer:
      "Click 'Forgot Password' on the login page and follow the instructions sent to your email.",
  },
  {
    question: "How long does delivery take?",
    answer: "Standard delivery takes 3-5 business days.",
  },
  {
    question: "Where can I track my order?",
    answer:
      "You can track your order using the 'Track Order' section in your account dashboard.",
  },
  {
    question: "Can I change my delivery address?",
    answer:
      "Yes, you can change your delivery address before the order is shipped. Go to your orders page and select 'Edit Address'.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, refunds are available within 7 days of delivery after item verification.",
  },
  {
    question: "How do I contact customer care?",
    answer: "You can reach customer care at support@unthinkable.co or via chat.",
  },
];

function generateSessionId() {
  return crypto.randomBytes(16).toString("hex");
}

function buildSystemPrompt() {
  const faqText = FAQS.map(
    (f, idx) => `${idx + 1}. Q: ${f.question}\n   A: ${f.answer}`
  ).join("\n");

  return `
You are an AI customer support assistant for Unthinkable Solutions.

Use ONLY the FAQs below to answer questions. 
If you know the answer from the FAQ, reply clearly and simply.

If the question is NOT answered in the FAQ:
- DO NOT write "ESCALATE:"
- Instead reply politely:
  "I'm not sure about this one. Would you like me to connect you with customer care?"

Speak in friendly, simple, human-like language. Do not sound like a robot.

Here are the FAQs:
${faqText}

Rules:
- Be concise, friendly, and professional.
- Use the FAQs first.
- If a question cannot be answered from the FAQ:
    Start reply with EXACTLY "ESCALATE:" (with colon)
- If answerable, reply normally without ESCALATE:.
  `;
}

// Create a new session
router.post("/session", async (req, res) => {
  try {
    const newId = generateSessionId();
    await Session.create({ sessionId: newId, messages: [] });

    return res.json({ sessionId: newId });
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
});

// Handle user message
router.post("/message", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: "Session not found" });

    // Save user message
    session.messages.push({ role: "user", content: message });
    await session.save();

    const groq = req.app.locals.groq;

    // Use last 10 messages for context
    const history = session.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Groq LLaMA 3.3 model
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...history.slice(-10),
      ],
      temperature: 0.3,
    });

    let reply = completion.choices[0].message.content;

    // Save bot message
    session.messages.push({ role: "assistant", content: reply });

    // Escalation detection
    const escalated = reply.startsWith("ESCALATE:");
    if (escalated) session.status = "escalated";

    await session.save();

    res.json({ reply, escalated });
  } catch (err) {
    console.error("Groq error:", err);
    res.status(500).json({ error: "Groq failed to respond" });
  }
});

// Generate summary
router.get("/session/:id/summary", async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.id });
    if (!session) return res.status(404).json({ error: "Session not found" });

    const groq = req.app.locals.groq;

    const transcript = session.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "Summarize this customer support conversation into key points and suggest next actions.",
        },
        { role: "user", content: transcript },
      ],
    });

    const summary = completion.choices[0].message.content;

    res.json({ summary });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

export default router;
