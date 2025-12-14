import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client only if the key is present to avoid immediate errors, 
// though the app requires it.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const createChatSession = () => {
  if (!ai) throw new Error("API Key is missing");
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are an intelligent AI assistant integrated into a web-based macOS simulation. 
      Keep your responses concise, helpful, and friendly. 
      If asked about the system, you can mention you are running in a simulated environment.
      Format your responses with Markdown if needed.`,
    },
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I didn't receive a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the AI service.";
  }
};