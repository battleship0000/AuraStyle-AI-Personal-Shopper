
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, CartItem } from "./types";
import { MOCK_PRODUCTS } from "./constants";

const getSystemInstruction = (cart: CartItem[]) => `
You are 'Aura', a world-class AI Shopping Assistant for 'AuraStyle'.
Current Cart Contents: ${cart.length > 0 ? cart.map(i => `${i.quantity}x ${i.name}`).join(', ') : 'Empty'}

Your goal is to provide expert, boutique-level advice. Use Google Search grounding to verify current fashion or tech trends if the user asks for "modern", "trending", or "best" items.

Knowledge Base:
${JSON.stringify(MOCK_PRODUCTS, null, 2)}

Guidelines:
1. Be sophisticated, professional, and trend-aware.
2. If the user has items in their cart, suggest complementary products (cross-sell).
3. If they ask about stock, refer to the database.
4. When suggesting products, mention their names exactly.
5. If you use Google Search, summarize the findings and relate them to AuraStyle products.
`;

export const getChatResponse = async (userMessage: string, history: ChatMessage[], cart: CartItem[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const formattedHistory = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: getSystemInstruction(cart),
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I'm having trouble connecting to my style database.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered a minor glitch. Could you try asking that again?";
  }
};

export const extractProductSuggestions = async (aiResponse: string): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Assistant response: "${aiResponse}". List mentioned product names from this catalog as a JSON array: ${MOCK_PRODUCTS.map(p => p.name).join(', ')}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const jsonStr = (response.text || "[]").trim();
    const suggestedNames: string[] = JSON.parse(jsonStr);
    
    return MOCK_PRODUCTS
      .filter(p => suggestedNames.includes(p.name))
      .map(p => p.id);
  } catch (error) {
    return [];
  }
};
