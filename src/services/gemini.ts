const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const generateEngineeringAdvice = async (prompt: string): Promise<string> => {
  try {
    // 2. Use the variable here
    const response = await fetch(`${API_URL}/api/ai-consultant`, {
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
    return data.response || "No response received from the engineering server.";

  } catch (error) {
    console.error("AI Service Error:", error);
    return "Connection to DAGIV Server failed. Please check your internet connection or contact support.";
  }
};