// client/src/App.jsx

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

import ChatBotIcon from "./assets/chatbot.png";

export default function App() {
  const API_BASE_URL = "http://localhost:5000/api/chat";

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // Create session on load
  useEffect(() => {
    const createSession = async () => {
      try {
        const res = await axios.post(`${API_BASE_URL}/session`);
        setSessionId(res.data.sessionId);

        // Default greeting message
        setMessages([
          {
            role: "assistant",
            content: "Hello! How can I assist you today?",
          },
        ]);
      } catch (err) {
        console.error("Error creating session", err);
      }
    };

    createSession();
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle send
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    const text = input;
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/message`, {
        sessionId,
        message: text,
      });

      const botMsg = {
        role: "assistant",
        content: res.data.reply,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-bg">
      <div className="chat-shell">
        {/* Header */}
        <header className="chat-header">
          <div className="header-left">
            <div className="avatar-circle">
              <img src={ChatBotIcon} alt="chatbot" className="avatar-icon" />
            </div>

            <div>
              <div className="contact-name">AI Support Assistant</div>
              <div className="contact-status">
                <span className="status-dot" />
                Online · Unthinkable Solutions
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="header-icon" />
            <div className="header-icon" />
          </div>
        </header>

        <hr className="header-divider" />

        {/* Chat Area */}
        <div className="chat-window">
          {messages.map((m, idx) =>
            m.role === "assistant" ? (
              <div key={idx} className="bot-row">
                <img src={ChatBotIcon} className="bot-msg-icon" alt="bot" />
                <div className="bubble bot">{m.content}</div>
              </div>
            ) : (
              <div key={idx} className="bubble user">
                {m.content}
              </div>
            )
          )}

          {/* Typing indicator */}
          {loading && (
            <div className="bot-row">
              <img src={ChatBotIcon} className="bot-msg-icon" alt="bot" />
              <div className="bubble bot typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>

            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form className="input-bar" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Write your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
