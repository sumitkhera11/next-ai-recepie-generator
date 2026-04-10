"use server";
import { generateRecipe } from "@/lib/ai/generateRecipe";
import { fetchRecipeImage } from "@/lib/images/fetchRecipeImage";
import { checkRecipeUsage, incrementRecipeUsage } from "@/actions/usage.actions";
import { getRecipeBySlug, createRecipe } from "@/lib/strapi";
import { slugify } from "@/lib/slugify";
import { authGuardAPI } from "@/lib/authGuardAPI";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// 1. Check DB
// 2. If exists → return
// 3. Else:
//    → Try AI
//    → If AI fails → fallback recipe
// 4. Fetch image (Unsplash)
// 5. Save to Strapi
// 6. Return recipe
export async function getOrGenerateRecipe(slug) {
    try {
        const user = await authGuardAPI();

        if (user.error) {
          return { success: false, error: user.error }
        }
    
        // ✅ VALIDATION
        if (!slug || typeof slug !== "string" || slug === "undefined") {
            return { success: false, error: "Invalid recipe slug" };
        }

        const cleanSlug = slugify(slug);

        // =========================
        // 1. CHECK STRAPI
        // =========================
        // ✅ 1️⃣ CHECK DB FIRST (Most Important Fix)
        const existingRecipe = await getRecipeBySlug(cleanSlug);
        if (existingRecipe?.recipe) {
            return {
                success: true,
                recipe: existingRecipe.recipe,
                fromCache: true,
            };
        }

        // 2️⃣ External API try
        const mealRes = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${cleanSlug}`
        );
        const mealData = await mealRes.json();

        if (mealData?.meals?.[0]) {
            console.log("FROM_MEALDB");
            const meal = mealData.meals[0];

            // 🔥 FIX: proper ingredient mapping
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const item = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];

                if (item && item.trim()) {
                    ingredients.push({
                        item,
                        quantity: measure || "",
                        unit: "",
                        notes: "",
                    });
                }
            }

            const formatted = {
                title: meal.strMeal,
                slug: cleanSlug,
                description: meal.strInstructions?.slice(0, 200),
                cuisine: meal.strArea?.toLowerCase() || "other",
                category: meal.strCategory?.toLowerCase() || "dinner",
                ingredients,
                instructions: [meal.strInstructions],
                servings: 2,
                imageurl: meal.strMealThumb,
                isPublic: true,
                author: user.id,
            };

            // save to Strapi
            const saved = await createRecipe(formatted, user.jwt);

            if (!saved) {
                return { success: false, error: "Strapi save failed (MealDB)" };
            }
            await incrementRecipeUsage();

            return {
                success: true,
                recipe: saved,
                fromCache: false,
            };
        }


        // 2. CHECK USAGE
        const usage = await checkRecipeUsage();
        console.log("USAGE:", usage)
        if (!usage.allowed) {
            return {
                success: false,
                error: "Free limit reached",
            };
        }

        const finalPrompt = `
                    Generate a detailed recipe for ${slug.replace(/-/g, " ")}

                    Return STRICT JSON format:
                    {
                    "title": "",
                    "description": "",
                    "cuisine": "",
                    "category": "",
                    "ingredients": [],
                    "instructions": [],
                    "prepTime": "",
                    "cookTime": "",
                    "servings": 0,
                    "nutrition": {
                        "fat": "",
                        "carbs": "",
                        "protein": "",
                        "calories": ""
                    },
                    "tips": [],
                    "substitutions": []
                    }

                    Rules:
                    - No markdown
                    - No explanation
                    - Only JSON
                    `;


        // =========================
        // 2. GENERATE FROM AI
        // =========================
        console.log("GENERATING FROM AI");
        const isAIEnabled = process.env.AI_ENABLED === "true";

        let aiRecipe;

        if (!isAIEnabled) {
            console.log("DEV MODE: AI DISABLED");

            aiRecipe = {
                title: slug.replace(/-/g, " "),
                description: "Dev mode recipe",
                cuisine: "indian",
                category: "dinner",
                ingredients: ["Salt", "Water"],
                instructions: ["Mix", "Cook"],
                prepTime: "10 min",
                cookTime: "20 min",
                servings: 2,
                nutrition: {
                    fat: "N/A",
                    carbs: "N/A",
                    protein: "N/A",
                    calories: "N/A",
                },
                tips: [],
                substitutions: [],
            };
        } else {
            aiRecipe = await generateRecipe(finalPrompt);
        }

        if (!aiRecipe) {
            console.log("AI_RECIPE_response:", aiRecipe);
            return { success: false, error: "AI Failed" };
        }

        // ✅ 5. GET IMAGE FROM UNSPLASH
        const recipeImage = await fetchRecipeImage(
            aiRecipe.title);
        console.log("UNSPALSH_RECIPE_IMAGE:", recipeImage)

        // ✅ 7️⃣ Normalize for Strapi
        const formattedRecipe = normalizeRecipe(
            aiRecipe,
            cleanSlug,
            user.id,
            recipeImage
        );
        // console.log("FORMATTED_RECIPE:", formattedRecipe)
        // console.log("FINAL PAYLOAD:", JSON.stringify({ data: formattedRecipe }, null, 2));


        // =========================
        // 3. SAVE TO STRAPI
        // =========================
        // console.log("USER_JWT:", user.jwt)
        const savedRecipe = await createRecipe(formattedRecipe, user.jwt);
        if (!savedRecipe) {
            return {
                success: false,
                error: "Strapi save failed (AI)",
            };
        }
        console.log("SAVED_RECIPE:", savedRecipe);

        // =========================
        // 4. UPDATE USAGE (VERY IMPORTANT)
        // =========================
        await incrementRecipeUsage(user.id, usage.currentUsage);

        return {
            success: true,
            recipe: savedRecipe,
            remaining: usage.remaining - 1,
            fromCache: false,
        };

    } catch (error) {
        console.error("FINAL ERROR:", error);
        return {
            success: false,
            error: error.message || "Something went wrong"
        };
    }
}

/* ======================================================
   🔥 NORMALIZATION LAYER
====================================================== */
function normalizeStringArray(value) {
    if (!value) return [];

    // If AI sends single string → convert to array
    if (typeof value === "string") {
        return value.trim() ? [value.trim()] : [];
    }

    // If not array → ignore
    if (!Array.isArray(value)) return [];

    // Clean array
    return value
        .filter((item) => typeof item === "string" && item.trim() !== "")
        .map((item) => item.trim());
}
function normalizeNutrition(nutrition) {
    if (!nutrition || typeof nutrition !== "object") {
        return {
            fat: "N/A",
            carbs: "N/A",
            protein: "N/A",
            calories: "N/A",
        };
    }
    return {
        fat: nutrition.fat || "N/A",
        carbs: nutrition.carbs || "N/A",
        protein: nutrition.protein || "N/A",
        calories: nutrition.calories || "N/A",
    };
}
function getCuisineImage(cuisine) {
    const map = {
        italian: "/images/cuisine/italian.png",
        chinese: "/images/cuisine/chinese.png",
        mexican: "/images/cuisine/mexican.png",
        indian: "/images/cuisine/indian.png",
        american: "/images/cuisine/american.png",
        thai: "/images/cuisine/thai.png",
        japanese: "/images/cuisine/japanese.png",
        mediterranean: "/images/cuisine/mediterranean.png",
        french: "/images/cuisine/french.png",
        korean: "/images/cuisine/korean.png",
        default: "/images/cuisine/default.png",
    };

    return map[cuisine] || map["default"];
}
function extractMinutes(value, fallback = 0) {
    if (!value) return fallback;
    if (typeof value === "number") return value;

    const lower = value.toLowerCase();
    const hourMatch = lower.match(/(\d+)\s*hour/);
    const minuteMatch = lower.match(/(\d+)\s*min/);

    let total = 0;
    if (hourMatch) total += Number(hourMatch[1]) * 60;
    if (minuteMatch) total += Number(minuteMatch[1]);

    if (total > 0) return total;

    const nums = lower.match(/\d+/g);
    if (!nums) return fallback;

    if (nums.length > 1) {
        const arr = nums.map(Number);
        return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    }

    return Number(nums[0]);
}
function normalizeDescription(description) {
    if (!description) return "";

    if (Array.isArray(description)) {
        return description
            .map(block => block.children?.map(c => c.text).join(""))
            .join("\n");
    }

    if (typeof description === "object") {
        return JSON.stringify(description);
    }

    return String(description);
}

function normalizeRecipe(aiRecipe, slug, userId, imageUrl) {
    const allowedCuisines = [
        "italian",
        "chinese",
        "mexican",
        "indian",
        "american",
        "thai",
        "japanese",
        "mediterranean",
        "french",
        "korean",
        "vietnamese",
        "spanish",
        "greek",
        "turkish",
        "moroccan",
        "brazilian",
        "caribbean",
        "middle-eastern",
        "british",
        "german",
        "portuguese",
        "other",
    ];
    const rawCuisine = (aiRecipe.cuisine || "").toLowerCase();


    // 🔥 Find first allowed cuisine that exists inside AI string
    const cuisineValue =
        allowedCuisines.find((c) => rawCuisine.includes(c)) || "other";

    const allowedCategories = [
        "breakfast",
        "lunch",
        "dinner",
        "snack",
        "dessert",
    ];
    const rawCategoryLower = (aiRecipe.category || "").toLowerCase();

    let categoryValue =
        allowedCategories.find((c) => rawCategoryLower.includes(c)) || "dinner";

    return {
        title: aiRecipe?.title?.trim() || slug.replace(/-/g, " "),
        slug,
        description: normalizeDescription(
            aiRecipe?.description || `A delicious ${slug.replace(/-/g, " ")} recipe.`
        ),
        cuisine: cuisineValue || "default",
        category: categoryValue || "dinner",
        ingredients: Array.isArray(aiRecipe?.ingredients) && aiRecipe.ingredients.length > 0
            ? aiRecipe.ingredients
            : [{ item: "Salt", quantity: "1", unit: "tsp", notes: "" }],
        instructions: Array.isArray(aiRecipe?.instructions) && aiRecipe.instructions.length > 0
            ? aiRecipe.instructions
            : ["Prepare ingredients", "Cook properly", "Serve hot"],
        preptime: extractMinutes(aiRecipe.prepTime, 10),
        cooktime: extractMinutes(aiRecipe.cookTime, 20),
        servings: aiRecipe?.servings || 2,
        nutrition: normalizeNutrition(aiRecipe.nutrition),
        tips: normalizeStringArray(aiRecipe.tips),
        substitutions: normalizeStringArray(aiRecipe.substitutions),
        imageurl: imageUrl && imageUrl.startsWith("http")
            ? imageUrl
            : getCuisineImage(cuisineValue),
        isPublic: true,
        author: userId
    };
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
    const user = await authGuardAPI();
    if (user.error) {
       return { success: false, error: user.error }
    }

    try {
        if (!recipeId) {
            throw new Error("Recipe name is required");
        }
        console.log("RECIPE_ID:", recipeId)

        // Check if already saved
        // Check existing
        const existingResponse = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.session.user.id}&filters[recipe][id][$eq]=${recipeId}&populate=*`,
            {
                headers: {
                    Authorization: `Bearer ${user.jwt}`,
                },
                cache: "no-store",
            }
        );

        console.log("EXISTING_RESPONSE:", existingResponse)
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
                Authorization: `Bearer ${user.jwt}`,
            },
            body: JSON.stringify({
                data: {
                    savedat: new Date().toISOString(),
                    user: user.session.user.id,
                    recipe: recipeId
                }
            }),
        });
        console.log("SAVE_RESPONSE:", saveResponse)
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
    const user = await authGuardAPI();
    if (user.error) {
      return { success: false, error: user.error }
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
                    Authorization: `Bearer ${user.jwt}`,
                },
                cache: "no-store",
            }
        );
        if (!searchResponse.ok) {
            throw new Error("Failed to find saved recipe");
        }
        console.log("SEARCH_RESPONSE:", searchResponse);
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
                    Authorization: `Bearer ${user.jwt}`,
                },
            }
        );

        if (!deleteResponse.ok) {
            throw new Error("Failed to remove recipe from collection");
        }
        console.log("DELETE_RESPONSE:", deleteResponse);

        return {
            success: true,
            message: "Recipe1 removed from your collection",
        };

    } catch (error) {
        console.error("❌ Error removing recipe from collection:", error);
        return {
            success: false,
            error: error.message,
        };
    }
}
