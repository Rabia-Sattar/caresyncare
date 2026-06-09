import { io } from "socket.io-client";

const socket = io(
  // "https://caresync-care-production.up.railway.app" ,
  // "http://localhost:5000",
  "https://caresync-final-year-project-software-engineering-production.up.railway.app",
   {
  transports: ["websocket"], // ✅ force websocket only
  withCredentials: true
});
export default socket;
