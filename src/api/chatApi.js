import API from "./axiosinstance";

// Fetch all messages for a family
export const getFamilyMessages = async (familyId) => {
  if (!familyId) throw new Error("familyId is required");

  try {
    const { data } = await API.get(`/api/chat/${familyId}`); // ✅ added /api/
    return data;
  } catch (err) {
    console.error("Error fetching messages:", err);
    throw err;
  }
};

// Send a message to a family
export const sendMessageApi = async (familyId, message) => {
  if (!familyId) throw new Error("familyId is required");

  try {
    const { data } = await API.post(`/api/chat/${familyId}`, message); // ✅ added /api/
    return data;
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
};
