import React, { useState } from "react";

const ChatInput = ({ socketRef, familyId }) => {
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim() || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      familyId,
      content: text,
    });

    setText("");
    socketRef.current.emit("stopTyping", { familyId });
  };

  return (
    <div className="chat-input">
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (socketRef.current) {
            socketRef.current.emit("typing", { familyId });
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatInput;
