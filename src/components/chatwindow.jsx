import React, { useEffect, useState, useRef } from "react";
import API from "../api/axiosinstance.js";
import socket from "../../socket/socket.js"; // ✅ ADD SOCKET
import { toast } from "react-toastify"; // 🍞 ADD TOAST
import "../pages/familychat.css";


const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

const ChatWindow = ({ family, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  
  // ---------------- FETCH MESSAGES ----------------
  useEffect(() => {
    if (!family) return;
    API.get(`/api/chat/${family._id}`).then((res) => setMessages(res.data));
  }, [family]);

  // ---------------- SOCKET REALTIME LISTENER ----------------
  useEffect(() => {
    if (!family) return;

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });

      // 🍞 TOAST (only for other users)
      if (msg.sender?._id !== currentUser?._id) {
        toast.info(
          `💬 ${msg.sender?.name}: ${msg.text || "Sent a file"}`
        );
      }
    };

    socket.on("receiveMessage", handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [family, currentUser]);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- FILE HANDLER ----------------
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    const formData = new FormData();
    formData.append("text", text);
    if (file) formData.append("file", file);

    const res = await API.post(
      `/api/chat/${family._id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setMessages((prev) => [...prev, res.data]);

    // 🍞 SUCCESS TOAST
    toast.success("Message sent");

    setText("");
    setFile(null);
  };

  return (
    <div className="chat-wrapper">
      <div className="chatmsg-container">

        {/* Header */}
        <header className="chat-header">
          <div className="header-content">
            <div className="header-info">
              <div className="avatar-wrapper">
                <div className="chat-avatar">{family?.name?.[0]}</div>
                <span className="online-badge"></span>
              </div>

              <div className="title-group">
                <h2 className="chat-title">{family?.name}</h2>
                <p className="chat-status">Active now</p>
              </div>
            </div>
          </div>
        </header>

        {/* Messages Body */}
        <div className="chat-body">
          {messages.map((msg) => {
            const isMe =
              (msg.sender?._id || msg.sender) === currentUser?._id;

            return (
              <div
                key={msg._id}
                className={`message-row ${isMe ? "me" : "other"}`}
              >
                {!isMe && (
                  <div className="sender-avatar">
                    {msg.sender?.name?.[0] || "Unknown"}
                  </div>
                )}

                <div className="message-bubble">

                  {!isMe && (
                    <div className="message-sender-name">
                      {msg.sender?.name}
                    </div>
                  )}

                  {msg.text && (
                    <p className="message-text">{msg.text}</p>
                  )}

                 {msg.file && (() => {
  const fileUrl = `${API_URL}/${msg.file}`;

const isImage =
  /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.file || "");
  
  return isImage ? (
    <div className="chat-image-wrapper">
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={fileUrl}
          alt="uploaded"
          className="chat-image"
        />
      </a>

      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="image-download"
      >
        ⬇ Download
      </a>
    </div>
  ) : (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="chat-file"
    >
      📎 Open file
    </a>
  );
})()}

                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input Area */}
        <footer className="chat-footer">
          <form className="input-bar" onSubmit={sendMessage}>
            <label htmlFor="file-upload" className="action-icon">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>

              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                file ? `Selected: ${file.name}` : "Type a message..."
              }
              className="chat-input-field"
            />

            <button type="submit" className="send-action-btn">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </footer>

      </div>
    </div>
  );
};

export default ChatWindow;