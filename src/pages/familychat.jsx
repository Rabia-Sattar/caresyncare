// src/pages/FamilyChat.jsx
import React, { useEffect, useState } from "react";
import API from "../api/axiosinstance";
import FamilyList from "../components/familylist";
import ChatWindow from "../components/chatwindow";
import "./familychat.css";

const FamilyChat = () => {
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ GET LOGGED-IN USER (SINGLE SOURCE OF TRUTH)
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // ---------------- FETCH FAMILIES ----------------
  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/family/my-families");
      setFamilies(res.data || []);
    } catch (error) {
      console.error("Error fetching families:", error);
      setFamilies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  // ---------------- UI ----------------
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">Loading Family Chats...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <FamilyList
        families={families}
        selectedFamily={selectedFamily}
        onSelect={setSelectedFamily}
      />

      {/* ✅ PASS CURRENT USER */}
      <ChatWindow
        family={selectedFamily}
        currentUser={currentUser}
      />
    </div>
  );
};

export default FamilyChat;