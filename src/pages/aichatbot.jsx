import React, { useState, useRef, useEffect } from "react";
import API from "../api/axiosinstance";
import { LuSend, LuBot, LuUser, LuSparkles } from "react-icons/lu";
import "./aichatbot.css";

const quickQuestions = [
  "What foods are good for high blood pressure?",
  "How can I lower my blood sugar naturally?",
  "What are signs of vitamin D deficiency?",
  "How much water should I drink daily?",
  "What exercises help with weight loss?",
];

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm CareSync AI 👋 Your personal health assistant. Ask me anything about health, nutrition, symptoms, or wellness tips!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    const newMessages = [...messages, { role: "user", content: userMsg, timestamp: new Date() }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const history = newMessages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await API.post("/api/ai/chat", { message: userMsg, history });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply, timestamp: new Date() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again!", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-page">
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-header-info">
          <div className="bot-avatar"><LuBot size={22} /></div>
          <div>
            <h5 className="mb-0">CareSync AI Health Assistant</h5>
            <small>Powered by Groq AI • Always available</small>
          </div>
        </div>
        <div className="online-badge">● Online</div>
      </div>

      {/* Quick Questions */}
      <div className="quick-questions">
        {quickQuestions.map((q, i) => (
          <button key={i} className="quick-btn" onClick={() => sendMessage(q)}>
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-row ${msg.role === "user" ? "user-row" : "bot-row"}`}>
            {msg.role === "assistant" && (
              <div className="msg-avatar bot-msg-avatar"><LuBot size={16} /></div>
            )}
            <div className={`message-bubble ${msg.role === "user" ? "user-bubble" : "bot-bubble"}`}>
              <p className="mb-0">{msg.content}</p>
              <span className="msg-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            {msg.role === "user" && (
              <div className="msg-avatar user-msg-avatar"><LuUser size={16} /></div>
            )}
          </div>
        ))}

        {loading && (
          <div className="message-row bot-row">
            <div className="msg-avatar bot-msg-avatar"><LuBot size={16} /></div>
            <div className="message-bubble bot-bubble typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chatbot-input-area">
        <div className="input-wrapper">
          <textarea
            className="chatbot-input"
            placeholder="Ask me anything about your health..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            <LuSend size={18} />
          </button>
        </div>
        <p className="input-disclaimer">
          <LuSparkles size={12} /> AI responses are for informational purposes only. Always consult a doctor for medical advice.
        </p>
      </div>
    </div>
  );
}
