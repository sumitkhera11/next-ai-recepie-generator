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

const apiKey = process.env.Dev_Gemini_key;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing");
}

const ai = new GoogleGenAI({
    apiKey: apiKey
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

Generate a COMPLETE recipe in STRICT JSON format.

IMPORTANT RULES:
- Do NOT return null
- Do NOT leave any field empty
- Always fill ALL fields
- Use realistic values
- ingredients must be array of objects
- instructions must be array of strings

Return ONLY JSON:

{
  "title": "string",
  "description": "string",
  "cuisine": "string",
  "category": "string",
  "ingredients": [
    {
      "item": "string",
      "quantity": "string",
      "unit": "string",
      "notes": "string"
    }
  ],
  "instructions": ["string"],
  "prepTime": "string",
  "cookTime": "string",
  "servings": number,
  "nutrition": {
    "fat": "string",
    "carbs": "string",
    "protein": "string",
    "calories": "string"
  },
  "tips": ["string"],
  "substitutions": ["string"]
}

User request:
${userPrompt}
`;

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL_IMAGE_TEXT_GENERATE,
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