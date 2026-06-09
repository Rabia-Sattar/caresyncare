import React from "react";

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`message ${isOwn ? "own" : ""}`}>
      {/* Show sender name for others */}
      {!isOwn && message.sender && (
        <strong>{message.sender.name}</strong>
      )}

      <p>{message.content}</p>

      <span className="time">
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
};

export default MessageBubble;
