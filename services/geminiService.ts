// services/geminiService.ts

/**
 * Sends the engineering query to the secure DAGIV Backend.
 * The backend handles the actual communication with Google Gemini.
 */
export const generateEngineeringAdvice = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('http://localhost:8000/api/ai-consultant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const data = await response.json();
    
    // The backend returns { status: "success", response: "..." }
    return data.response || "No response received from the engineering server.";

  } catch (error) {
    console.error("AI Service Error:", error);
    return "Connection to DAGIV Server failed. Please check your internet connection or contact support.";
  }
};