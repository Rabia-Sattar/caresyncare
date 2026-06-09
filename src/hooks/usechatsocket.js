import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://caresync-final-year-project-software-engineering-production.up.railway.app";
  // "http://localhost:5000";
// "https://caresync-care-production.up.railway.app";


const useChatSocket = (token, familyId, handlers = {}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !familyId) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinFamily", familyId);
    });

    // Message received
    socket.on("receiveMessage", handlers.onMessage);

    // Typing
    socket.on("typing", handlers.onTyping);
    socket.on("stopTyping", handlers.onStopTyping);

    // Read receipt
    socket.on("messageRead", handlers.onMessageRead);

    return () => {
      socket.disconnect();
    };
  }, [token, familyId]);

  return socketRef;
};

export default useChatSocket;
