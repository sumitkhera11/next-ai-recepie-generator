// These ONLY talk to Gemini.

// No DB logic here.
import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({
  apiKey: process.env.SAGAR_GEMINI_API_KEY,
});

export async function scanPantryImage(formData) {
  try {
    // check user authentication first
    
    // const model = genAI.getGenerativeModel({
    //   model: "gemini-1.5-flash",
    // });
    const imageFile = formData.get("image")
    if (!imageFile) {
      throw new Error("No image provided")
    }
    // convert image to base64
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")

    // const model = ai.GoogleGenerativeAI({
    //   model: "gemini-2.5-flash-lite",
    // })

    const prompt = `
You are a professional chef and ingredient recognition expert. Analyze this image of a pantry/fridge and identify all visible food ingredients.

Return ONLY a valid JSON array with this exact structure (no markdown, no explanations):
[
  {
    "name": "ingredient name",
    "quantity": "estimated quantity with unit",
    "confidence": 0.95
  }
]

Rules:
- Only identify food ingredients (not containers, utensils, or packaging)
- Be specific (e.g., "Cheddar Cheese" not just "Cheese")
- Estimate realistic quantities (e.g., "3 eggs", "1 cup milk", "2 tomatoes")
- Confidence should be 0.7-1.0 (omit items below 0.7)
- Maximum 20 items
- Common pantry staples are acceptable (salt, pepper, oil)
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: imageFile.type, // important
                data: base64Image,        // base64 here
              },
            },
          ],
        },
      ],
    });
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty AI response");
    }
    const cleaned = text.replace(/```json|```/g, "").trim();

    const ingredients = JSON.parse(cleaned)

    // Parse JSON response

    // try {
    //   const cleanText = text
    //     .replace(/```json\n?/g, "")
    //     .replace(/```\n?/g, "")
    //     .trim();
    //   ingredients = JSON.parse(cleanText);
    // } catch (parseError) {
    //   console.error("Failed to parse Gemini response:", text);
    //   throw new Error("Failed to parse ingredients. Please try again.");
    // }
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error(
        "No ingredients detected in the image. Please try a clearer photo."
      );
    }
    // return {
    //   success: true,
    //   ingredients: ingredients.slice(0, 20),
    //   scanLimit: 5,
    //   message: `Found ${ingredients.length} ingredients!`,
    // }
    return {
      success: true,
      ingredients: ingredients.slice(0, 20),
    };

  } catch (error) {
    console.error("Error scanning pantry:", error);
    throw new Error(error.message || "Failed to scan image");
  }
}

export async function saveToPantry(formData) {

}
export async function addPantryItemManually(formData) {}

export async function getPantryItems(formData) {}

export async function deletePantryItems(formData) {}
