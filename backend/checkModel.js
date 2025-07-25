// checkModels.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = await genAI.listModels();
    
    console.log("Available models for your API key:");
    for await (const m of models) {
      if (m.supportedGenerationMethods.includes('generateContent')) {
        console.log(m.name);
      }
    }
  } catch (error) {
    console.error("Failed to list models:", error);
  }
}

listModels();