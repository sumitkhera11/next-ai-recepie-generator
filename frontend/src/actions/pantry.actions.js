"use server";
import { GoogleGenAI } from "@google/genai";
import { checkUserServer } from "@/lib/checkUserServer";
import { revalidatePath } from "next/cache";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

import { FREE_LIMIT } from "@/lib/constants/limits";

if (!STRAPI_URL) {
    throw new Error("STRAPI_URL is not defined");
}

const apiKey = process.env.Papa_Gemini_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing");
}

const genAI = new GoogleGenAI({
    apiKey: apiKey
});

export async function checkScanUsage() {

  const user = await checkUserServer();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const today = new Date().toLocaleDateString("en-CA");

  const res = await fetch(`${STRAPI_URL}/users/${user.id}`, {
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
  });

  const strapiUser = await res.json();

  let dailyScanUsage = strapiUser.dailyScanUsage || 0;
  let lastUsageDate = strapiUser.lastUsageDate;

  if (lastUsageDate !== today) {
    dailyScanUsage = 0;
  }

  if (dailyScanUsage >= FREE_LIMIT) {
    return {
      allowed: false,
      currentUsage: dailyScanUsage,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    currentUsage: dailyScanUsage,
    remaining: FREE_LIMIT - dailyScanUsage,
  };
}

export async function incrementScanUsage(currentUsage) {

  const user = await checkUserServer();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const today = new Date().toLocaleDateString("en-CA");

  await fetch(`${STRAPI_URL}/users/${user.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dailyScanUsage: currentUsage + 1,
      lastUsageDate: today,
    }),
  });

  return { success: true };
}

export async function scanPantryImage(formData) {
    const user = await checkUserServer();
    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const imageFile = formData.get("image");
        if (!imageFile) {
            throw new Error("No image provided");
        }
        // convert image to base64
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString("base64");


        const prompt = `
You are an expert food ingredient recognition system used in a smart kitchen assistant.

Analyze this pantry or fridge image carefully and identify all visible edible ingredients.

Focus ONLY on real food ingredients.

Return ONLY a valid JSON array (no markdown, no explanations):

[
  {
    "name": "ingredient name",
    "quantity": "estimated quantity with unit",
    "confidence": 0.95
  }
]

Instructions:

1. Identify only edible ingredients (vegetables, fruits, dairy, meat, grains, spices, sauces).
2. Ignore containers, packaging, utensils, labels, and non-food objects.
3. Be specific when possible (e.g., "Red Bell Pepper", "Cherry Tomato", "Cheddar Cheese").
4. Estimate realistic quantities (examples: "3 eggs", "2 tomatoes", "1 onion", "1 cup milk").
5. Merge duplicate ingredients into a single item.
6. If an ingredient appears multiple times, combine quantities.
7. Only include ingredients with confidence >= 0.7.
8. Maximum 20 ingredients.
9. Think carefully before identifying ingredients to avoid guessing.
10. If unsure about an item, do not include it.

Return ONLY the JSON array.
`;

        const result = await genAI.models.generateContent({
            model: process.env.GEMINI_MODEL_IMAGE_SCAN,
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: imageFile.type,
                                data: base64Image,
                            },
                        },
                    ],
                },
            ],
        });

        const text = result.text;

        // Parse JSON response
        let ingredients;
        try {
            const cleanText = text
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
            ingredients = JSON.parse(cleanText);
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", text);
            throw new Error("Failed to parse ingredients. Please try again.");
        }
        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            throw new Error("No ingredients detected in the image. Please try a clearer photo.")
        }
        return {
            success: true,
            ingredients: ingredients.slice(0, 20),
            message: `Found ${ingredients.length} ingredients!`
        };

    } catch (error) {
        console.error("Error scanning pantry:", error);
        throw new Error(error.message || "Failed to scan image");
    }
}

export async function saveToPantry(formData) {
    const user = await checkUserServer();
    if (!user) {
        return { success: false, error: "Unauthorized" }
    }
    try {
        const ingredientsJson = formData.get("ingredients");
        const ingredients = JSON.parse(ingredientsJson);
        if (!ingredients || ingredients.length === 0) {
            throw new Error("No ingredients to save")
        }

        const savedItems = [];
        for (const ingredient of ingredients) {
            const response = await fetch(`${STRAPI_URL}/api/pantry-items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                },
                body: JSON.stringify({
                    data: {
                        name: ingredient.name,
                        quantity: ingredient.quantity,
                        imageUrl: "",
                        owner: user.id,
                    },
                }),
            });

            if (response.ok) {
                const data = await response.json()
                savedItems.push(data.data);
            }
        }
        return {
            success: true,
            savedItems,
            message: `Saved ${savedItems.length} items to your pantry!`
        }
    } catch (error) {
        console.error("Error save to your pantry", error);
        throw new Error(error.message || "Failed to save items");
    }
}
export async function addPantryItemsManually(formData) {
    const user = await checkUserServer();
    if (!user) {
        return { success: false, error: "Unauthorized" }
    }
    try {
        const name = formData.get("name");
        const quantity = formData.get("quantity");
        if (!name?.trim() || !quantity?.trim()) {
            return {
                success: false,
                message: "Please enter ingredient name and quantity"
            };
        }
        const response = await fetch(`${STRAPI_URL}/api/pantry-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            body: JSON.stringify({
                data: {
                    name: name.trim(),
                    quantity: quantity.trim(),
                    imageurl: "",
                    owner: user.id,
                },
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to add item:", errorText);;
            throw new Error("Failed to add pantry item manually")
        }

        const data = await response.json()
        revalidatePath("/pantry");

        return {
            success: true,
            item: data.data,
            message: `Item added successfully`,
        };

    } catch (error) {
        console.error("Error item added manually:", error);
        return {
            success: false,
            message: "Failed to add item"
        };
    }

}
export async function getPantryItems() {
    const user = await checkUserServer();
    if (!user) {
        return { success: false, items: [] };
    }
    try {
        const response = await fetch(
            `${STRAPI_URL}/api/pantry-items?filters[owner][id][$eq]=${user.id}&sort=createdAt:desc`,
            {
                headers: {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                },
                cache: "no-store" // caching
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch pantry items");
        }
        const data = await response.json();
        // const isPro = user.subscriptionTier === "pro";

        return {
            success: true,
            items: data.data || [],
            //   scansLimit: isPro ? "unlimited" : 10,
        };
    } catch (error) {
        console.error("Error fetching pantry:", error);
        throw new Error(error.message || "Failed to load pantry");
    }
}

export async function deletePantryItem(itemId) {
    const user = await checkUserServer();
    if (!user) {
        return { success: false, error: "Unauthorized" }
    }

    const res = await fetch(`${STRAPI_URL}/api/pantry-items/${itemId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to delete item");
    }
    return { success: true };
}
// Update pantry item
export async function updatePantryItem(formData) {
    const user = await checkUserServer();
    if (!user) {
        return { success: false, error: "Unauthorized" }
    }

    const itemId = formData.get("itemId");
    const name = formData.get("name");
    const quantity = formData.get("quantity");

    const response = await fetch(`${STRAPI_URL}/api/pantry-items/${itemId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
            data: {
                name,
                quantity,
            },
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to update item");
    }

    return await response.json();
}
