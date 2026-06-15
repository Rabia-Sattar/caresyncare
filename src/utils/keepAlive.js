// src/utils/keepAlive.js
const BACKEND_URL = "https://caresync-final-year-project-software-engineering-production.up.railway.app";

export const startKeepAlive = () => {
  // Har 4 minute mein ping karo
  setInterval(async () => {
    try {
      await fetch(`${BACKEND_URL}/health`);
      console.log("✅ Backend alive");
    } catch (err) {
      console.log("Backend ping failed");
    }
  }, 4 * 60 * 1000); // 4 minutes
};
