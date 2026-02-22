import { GoogleGenerativeAI } from '@google/generative-ai';
import MOCK_DATA from '../data/indian_foods_200.json';

// Initialize Gemini if key exists
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Clean up and format the Indian Foods JSON dataset
export const FOOD_DATABASE = MOCK_DATA.map((item, index) => ({
    id: index,
    name: item["Food Name"],
    calories: parseFloat(item["Energy (kcal)"]) || 0,
    protein: parseFloat(item["Protein (g)"]) || 0,
    carbs: parseFloat(item["Carbohydrate (g)"]) || 0,
    // Approximate sugar from carbs for the demo constraints, or 0
    sugar: Math.round((parseFloat(item["Carbohydrate (g)"]) || 0) * 0.1),
    fat: parseFloat(item["Fat (g)"]) || 0
}));

export const aiService = {
    /**
     * Mock Image Analyzer or Gemini Vision
     * Falls back to a random food entry from the DB if no API key is present.
     */
    analyzeFoodImage: async (base64Image) => {
        if (genAI && base64Image) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = "Identify the Indian food in this image. Return strictly a JSON object replacing the keys with your estimates: {\"name\": \"string\", \"calories\": 0, \"protein\": 0, \"sugar\": 0}. Do not format with markdown.";

                // base64 parsing (remove data uri prefix)
                const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

                const result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: "image/jpeg"
                        }
                    }
                ]);

                const text = result.response.text();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
            } catch (error) {
                console.error("Gemini Scan Error:", error);
            }
        }

        console.log("Using Mock AI Scan...");
        // Mock Random Database Entry Selection
        const randomFood = FOOD_DATABASE[Math.floor(Math.random() * FOOD_DATABASE.length)];
        return {
            name: randomFood.name,
            calories: randomFood.calories,
            protein: randomFood.protein,
            sugar: randomFood.sugar
        };
    },

    /**
     * Generates a dynamic AI Coach response.
     */
    generateCoachMessage: async ({ totals, score, status, defaultMessage }) => {
        if (!genAI) return defaultMessage;

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `You are a tough, uncompromising but highly motivating AI Nutrition Coach. 
The user's daily metrics: ${totals.calories} kcal, ${totals.sugar}g sugar, ${totals.protein}g protein. 
Their discipline score today is ${score}/100, status: ${status}. 
Give a very short, punchy 2-sentence feedback evaluating their performance today. No emojis. Make it sound like a strict sensei.`;

            const result = await model.generateContent(prompt);
            return result.response.text().trim().replace(/"/g, ''); // strip quotes
        } catch (error) {
            console.error("Gemini Coach Error:", error);
            return defaultMessage;
        }
    }
};
