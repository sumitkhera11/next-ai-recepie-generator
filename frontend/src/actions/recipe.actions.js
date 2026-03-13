"use server";
import { checkUserServer } from "@/lib/checkUserServer";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function getOrGenerateRecipe(slug) {
    const user = await checkUserServer();

    if (!user) {
        return { success: false, error: "Unauthorized" }
    }
    try {
        if (!slug || typeof slug !== "string") {
            return { success: false, error: "Invalid recipe slug" }
        }
        const res = await fetch(`${STRAPI_URL}/api/recipes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                slug,
                userPrompt: `Generate a detailed recipe for ${slug.replace(/-/g, " ")}`,
            }),
            cache: "no-store",
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data.recipe;

    } catch (error) {
        throw new Error(error.message || "Failed to load recipe")
    }
}
// Create relation between user & recipe
// Ye kya hai?
// 👉 User-specific action
// 👉 Private data
// 👉 Modify database
// Yahan token mandatory hai.
// // 1. Check existing
// fetch(... saved-recipes?filters...)

// // 2. Create saved-recipe
// fetch(... saved-recipes, { method: "POST" })
// Dono protected endpoints hain.
// Dono me token required hai.
export async function saveRecipeToCollection(recipeId) {
    const user = await checkUserServer();

    if (!user) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        if (!recipeId) {
            throw new Error("Recipe name is required");
        }

        // Check if already saved
        // Check existing
        const existingResponse = await fetch(
            `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${recipeId}&populate=*`,
            {
                headers: {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                },
                cache: "no-store",
            }
        );

        if (existingResponse.ok) {
            const existingData = await existingResponse.json();
            if (existingData.data?.length > 0) {
                return {
                    success: true,
                    alreadySaved: true,
                    message: "Recipe is already in your collection"
                }
            }
        }
        // create saved recipe relation
        const saveResponse = await fetch(`${STRAPI_URL}/api/saved-recipes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            body: JSON.stringify({
                data: {
                    savedat: new Date().toISOString(),
                    user: user.id,
                    recipe: recipeId
                },
            }),
        });
        if (!saveResponse.ok) {
            throw new Error("Failed to save recipe to collection");
        }
        const savedRecipe = await saveResponse.json();

        return {
            success: true,
            alreadySaved: false,
            savedRecipe: savedRecipe.data,
            message: "Recipe saved to your collection!",
        };

    } catch (error) {
        throw new Error(error.message || "Failed to save recipe")
    }
}

// ` recipe from user's collection (unbookmark)
export async function removeRecipeFromCollection(recipeId) {
    const user = await checkUserServer();
    if (!user) {
        return { success: false, error: "Unauthorized" }
    }


    try {
        if (!recipeId) {
            throw new Error("Recipe ID is required");
        }
        // Find saved recipe relation
        const searchResponse = await fetch(
            `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${recipeId}`,
            {
                headers: {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                },
                cache: "no-store",
            }
        );
        if (!searchResponse.ok) {
            throw new Error("Failed to find saved recipe");
        }
        const searchData = await searchResponse.json();
        if (!searchData.data || searchData.data.length === 0) {
            return {
                success: true,
                message: "Recipe was not in your collection",
            };
        }
        // Delete saved recipe relation
        const savedRecipeId = searchData.data[0].id;
        const deleteResponse = await fetch(
            `${STRAPI_URL}/api/saved-recipes/${savedRecipeId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                },
            }
        );

        if (!deleteResponse.ok) {
            throw new Error("Failed to remove recipe from collection");
        }

        return {
            success: true,
            message: "Recipe removed from your collection",
        };

    } catch (error) {
        console.error("❌ Error removing recipe from collection:", error);
        throw new Error(error.message || "Failed to remove recipe");
    }
}
