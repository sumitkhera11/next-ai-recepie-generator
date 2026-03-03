// src/lib/ai/generateRecipe.js
// Handles ONLY recipe generation
// Clean, production-ready version

// These ONLY talk to Gemini.

// No DB logic here.
//generateRecipe.js runs on server side
// Layer 1 — AI Engine

// Pure AI.
// No auth.
// No DB.
// No usage logic.

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.SAGAR_GEMINI_API_KEY, // rename env to clean format
});
// do not touch this code
export async function generateRecipe(userPrompt) {
    try {
        if (!userPrompt || userPrompt.trim().length === 0) {
            throw new Error("Prompt is required");
        }

        // Optional: prompt length safety
        if (userPrompt.length > 2000) {
            throw new Error("Prompt too long");
        }

        const systemPrompt = `
You are a professional chef AI.

Generate a detailed recipe based on the user request.

Return response in clean JSON format:

Generate a recipe in strict JSON format:
{
  "title": "",
  "description": "",
  "ingredients": [],
  "instructions": [],
  "cuisine": "",
  "prepTime": "",
  "cookTime": ""
}
Return ONLY valid JSON.

User Request:
${userPrompt}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
            ],
        });

        // ✅ THIS IS THE CORRECT WAY
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("Empty response from Gemini");
        }

        // Optional: Clean markdown code block if model wraps JSON
        const cleaned = text.replace(/```json|```/g, "").trim();

        return JSON.parse(cleaned);


    } catch (error) {
        console.error("Gemini Recipe Error:", error);
        throw new Error("Failed to generate recipe");
    }
}