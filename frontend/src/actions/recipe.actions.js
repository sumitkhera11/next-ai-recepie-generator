"use server";
import { checkUserServer } from "@/lib/checkUserServer";
import { redirect } from "next/navigation"


export async function getOrGenerateRecipe(slug) {
    const user = await checkUserServer();
    if (!user) {
        redirect("/")
    }

    try {
        if (!slug) {
            throw new Error("Recipe name is required");
        }
        const res = await fetch("http://localhost:3000/api/recipes", {

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
        console.log("DATA_RECIPE_ID:", data.recipe);

        return data.recipe;

    } catch (error) {
        console.log("❌ Error in getOrGenerateRecipe", error)
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
        redirect("/")
    }

    try {
        // console.log("RECIPE_SAVED_TO_COLLECTION:",recipeId);
        console.log("SAVING_RECIPE_ID:", recipeId);

        // const user = await checkUserServer();
        if (!recipeId) {
            // if(!slug.get("slug")) {
            throw new Error("Recipe name is required");
        }
        const user = { id: 7 };
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
        console.log('EXISTING_RESPONSE:', existingResponse);

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
            const errorText = await saveResponse.text();
            console.error("❌ Failed to save recipe:", errorText);
            throw new Error("Failed to save recipe to collection");
        }
        const savedRecipe = await saveResponse.json();
        console.log("STRAPI_SAVE_RESPONSE:", savedRecipe);
        console.log("✅ Recipe saved to user collection:", savedRecipe.data.id);

        return {
            success: true,
            alreadySaved: false,
            savedRecipe: savedRecipe.data,
            message: "Recipe saved to your collection!",
        };

    } catch (error) {
        console.log("❌ Error in saveRecipeToCollection", error)
        throw new Error(error.message || "Failed to save recipe")
    }
}

// ` recipe from user's collection (unbookmark)
export async function removeRecipeFromCollection(recipeId) {
    const user = await checkUserServer();
    if (!user) {
        redirect("/")
    }

    try {
        console.log("RECIPE_REMOVE_FROM_COLLECTION:", recipeId);
        if (!recipeId) {
            throw new Error("Recipe ID is required");
        }
        const user = { id: 7 };
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

        console.log("✅ Recipe removed from user collection");

        return {
            success: true,
            message: "Recipe removed from your collection",
        };

    } catch (error) {
        console.error("❌ Error removing recipe from collection:", error);
        throw new Error(error.message || "Failed to remove recipe");
    }
}
