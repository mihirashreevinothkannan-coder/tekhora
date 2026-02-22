import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyDxiFEWkBqKjBZdkJw6QJSRxeRKdgSIFmY";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testGemini() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = "Say hello";
        const result = await model.generateContent(prompt);
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("Error:", e);
    }
}

testGemini();
