import { GoogleGenAI, Type } from "@google/genai";

export const getGeminiResponse = async (prompt: string, history: any[] = []) => {
  try {
    // Fix: Use process.env.API_KEY directly as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...(history || []).map(h => ({ 
          role: h.role === 'model' ? 'model' : 'user', 
          parts: h.parts || [{ text: h.text || "" }] 
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "Eres el Estratega Jefe de DistriMaster HQ. Responde SIEMPRE en español (Latinoamérica). Eres un experto en logística, distribución mayorista y tecnología SaaS. Tu tono es profesional, eficiente y orientado a resultados.",
        temperature: 0.7,
      }
    });

    return response.text || "No se pudo obtener una respuesta de la IA.";
  } catch (error) {
    console.error("Gemini Failure:", error);
    return "Error de conexión con el núcleo de inteligencia.";
  }
};

export const analyzeStockRisks = async (products: any[]) => {
  try {
    // Fix: Use process.env.API_KEY directly as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const context = products.slice(0, 10).map(p => ({ sku: p.sku, name: p.name, stock: p.stock }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ 
        role: 'user', 
        parts: [{ text: `Analiza riesgos de inventario: ${JSON.stringify(context)}. Devuelve JSON con sku, risk_level (HIGH/MEDIUM), days_left (integer) y action (string).` }] 
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sku: { type: Type.STRING },
              risk_level: { type: Type.STRING },
              days_left: { type: Type.INTEGER },
              action: { type: Type.STRING }
            },
            required: ["sku", "risk_level", "days_left", "action"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return [];
  }
};