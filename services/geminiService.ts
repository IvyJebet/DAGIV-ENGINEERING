import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
    // In a real app, ensure process.env.API_KEY is defined. 
    // For this demo, we assume the environment is set up correctly.
    // Use the user-provided key if available in a full implementation.
    const apiKey = process.env.API_KEY || 'YOUR_MOCK_KEY_FOR_BUILD'; 
    return new GoogleGenAI({ apiKey });
};

export const generateEngineeringAdvice = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a senior mechanical engineer at DAGIV ENGINEERING in Kenya. You provide brief, technical, and safety-conscious advice about heavy machinery, maintenance, and industrial equipment. Keep answers under 100 words. Be professional and authoritative.",
      }
    });
    return response.text || "I apologize, I cannot provide advice at this moment. Please contact our engineers directly.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "System offline. Please try consulting a human engineer via our contact page.";
  }
};