import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const getHealthAdvice = async (symptoms) => {
  if (!API_KEY) return "AI Assistance unavailable: Missing API Key.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is describing symptoms: ${symptoms}. 
      Provide a brief health disclaimer and suggest which type of specialist they should see. 
      Keep it professional, supportive, and under 150 words.`,
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI assistant. Please consult a professional directly.";
  }
};

export const getDashboardQuote = async () => {
  if (!API_KEY) return "Stay healthy!";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a unique, short, inspiring health quote for the day.",
    });
    return response.text?.trim() || "Your health is your wealth.";
  } catch {
    return "Prioritize your wellbeing.";
  }
};
