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
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
    },

    /**
     * Interactive Chat with Coach
     */
    chatWithCoach: async (history, message, userStats) => {
        if (!genAI) {
            return "I am a mock AI. Please provide a valid Gemini API Key to chat with your real coach.";
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            // Format history
            const contextHistory = history.map(msg => `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}`).join('\n');
            const statsContext = userStats ? `Current Stats: ${userStats.calories.current}/${userStats.calories.target} kcal, ${userStats.protein.current}g protein, ${userStats.sugar.current}g sugar.` : '';

            const prompt = `You are a tough, uncompromising but highly motivating AI Nutrition Coach for an Indian food app.
${statsContext}

Chat History:
${contextHistory}

User says: "${message}"

Respond strictly as the Coach concisely. Do not use markdown like bolding or bullet points. Keep it under 3 sentences and sound like a strict sensei.`;

            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            console.error("Gemini Chat Error:", error);
            return "Connection to my server is currently failing. Stay disciplined anyway.";
        }
    },

    /**
     * Generate Diet Plan based on user metrics
     */
    generateDietPlan: async (userStats, userGoal) => {
        if (!genAI) {
            return `## Mock Diet Plan\n- **Breakfast**: Poha (300 kcal)\n- **Lunch**: 2 Roti + Dal (400 kcal)\n- **Dinner**: Paneer Tikka (350 kcal)`;
        }

        try {
            // Use extremely high temperature and TopK for totally random/novel plan generation
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: {
                    temperature: 1.4, // ultra-high variance
                    topK: 60,
                    topP: 0.95,
                }
            });
            const statsContext = userStats ? `Current Stats so far today: ${userStats.calories.current}/${userStats.calories.target} kcal, ${userStats.protein.current}g protein, ${userStats.sugar.current}g sugar.` : '';
            const timestamp = new Date().getTime(); // True random string

            const prompt = `You are an expert AI Nutrition Coach for an Indian food app. The user's goal is: ${userGoal || 'Maintain'}. 
${statsContext}

Generate a concise, COMPLETELY UNIQUE and NEVER-BEFORE-SEEN personalized Indian diet plan for today to help the user hit their macro targets. 
TIMESTAMP SEED: ${timestamp}. Ignore previous cache. Provide completely different Indian dishes from the standard fare (e.g., skip basic paneer or roti if you suggested it recently). Pull from obscure regional Indian cuisines (South Indian, Bengali, Maharashtrian, etc.).

Recommend exactly 3 meals (Breakfast, Lunch, Dinner) and optional snacks. 
Include approximate calories and protein for each meal. 
Suggest different Indian dishes than usual. 
Format intelligently using simple markdown (bolding, simple unnested lists). Do NOT over-explain. Do not use complex tables. Just the plan.`;

            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            console.error("Gemini Diet Plan Error:", error);
            return "Failed to generate diet plan. Please check your connection.";
        }
    },

    /**
     * Parse natural language text to estimate food macros
     */
    parseNaturalLanguageFood: async (textInput) => {
        if (!genAI) {
            console.log("Mock AI NLP Parse");
            return {
                name: "Mock AI Estimate",
                calories: 300,
                protein: 10,
                sugar: 5
            };
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `You are a strict Indian food nutrition database parser. 
The user typed: "${textInput}".
Identify the food and portion they ate. Estimate the typical calories, protein (g), and sugar (g).
Return STRICTLY a JSON object with NO markdown formatting: {"name": "Detected Food Name", "calories": number, "protein": number, "sugar": number}.`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error("Failed to parse JSON from AI response.");
        } catch (error) {
            console.error("Gemini NLP Error:", error);
            throw error;
        }
    },

    /**
     * Generate Insights for the Analytics Page
     */
    generateWeeklyInsights: async (weeklyData) => {
        if (!genAI) {
            return "Your discipline is steady. Watch the sugar spikes on weekends. Keep pushing your caloric limits to build more muscle.";
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            // Summarize the data for the prompt
            const dataString = weeklyData.map(d => `${d.day}: ${d.calories}kcal, ${d.protein}g protein, ${d.sugar}g sugar, Score: ${d.score}`).join('\n');

            const prompt = `You are an elite AI Health Analyst. Review this user's last 7 days of nutrition data:
${dataString}

Provide a short, 3-sentence deep-dive analysis of their trends. Point out any concerning sugar spikes, caloric drops, or discipline praise. Speak directly to the user in a strict, analytical, "health hacker" tone. No bullet points.`;

            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            console.error("Gemini Insights Error:", error);
            return "Failed to analyze trends. System offline.";
        }
    },

    /**
     * Generate Workout Plan focusing on reducing excess calories
     */
    generateWorkoutPlan: async (userStats, userGoal) => {
        if (!genAI) {
            return `## Mock Workout Plan\n- **Warmup**: 10 mins jogging\n- **Cardio**: 30 mins HIIT to burn excess calories\n- **Cooldown**: 5 mins stretching`;
        }

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: {
                    temperature: 0.9,
                }
            });

            const caloriesEaten = userStats?.calories?.current || 0;
            const caloriesTarget = userStats?.calories?.target || 2000;
            const excessCalories = Math.max(0, caloriesEaten - caloriesTarget);

            let statsContext = `The user has consumed ${caloriesEaten} kcal today against a target of ${caloriesTarget} kcal.`;
            if (excessCalories > 0) {
                statsContext += ` They have an excess of ${excessCalories} kcal.`;
            } else {
                statsContext += ` They are currently in a deficit or on track, but want a good workout.`;
            }

            const prompt = `You are a tough, elite AI Personal Trainer. The user's goal is: ${userGoal || 'Fitness'}. 
${statsContext}

Generate a highly effective, structured workout plan for today. 
CRITICAL REQUIREMENT: If the user has excess calories, specifically design the workout to burn off those excess calories (e.g., recommend HIIT, intense cardio, or heavy lifting with minimal rest). Mention how the workout helps reduce the excess intake.
If they don't have excess calories, provide a solid, balanced muscle-building or endurance workout.

Format the response using simple markdown (bolding, simple unnested lists). Make it actionable, intense, and motivating. Do not use complex tables.`;

            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            console.error("Gemini Workout Plan Error:", error);
            if (error.message?.includes('429') || error.status === 429 || error.message?.includes('quota')) {
                return "You've hit the free tier Gemini API rate limit! Please wait about 30 seconds and click Generate again.";
            }
            return "Failed to generate workout plan. Please check your connection or API key.";
        }
    }
};
