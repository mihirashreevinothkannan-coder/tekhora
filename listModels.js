import { GoogleGenerativeAI } from '@google/generative-ai';
const API_KEY = "AIzaSyDxiFEWkBqKjBZdkJw6QJSRxeRKdgSIFmY";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        const fs = await import('fs');
        fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}
listModels();
