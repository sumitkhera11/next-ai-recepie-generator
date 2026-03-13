import { checkRecipeUsage, incrementRecipeUsage } from "@/actions/usage.actions";
import { generateRecipe } from "@/lib/ai/generateRecipe";
import { getRecipeBySlug, createRecipe } from "@/lib/strapi";
import slugify from "slugify";
import { fetchRecipeImage } from "@/lib/images/fetchRecipeImage";
import { checkUserServer } from "@/lib/checkUserServer";

export async function POST(req) {
    try {
        const body = await req.json();
        const user = await checkUserServer(); // TODO: Replace with real auth

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug, userPrompt, ingredients, source } = body;

        if (!slug) {
            return Response.json(
                { error: "Slug is required" },
                { status: 400 }
            );
        }

        // ✅ 1️⃣ CHECK DB FIRST (Most Important Fix)
        const existingRecipe = await getRecipeBySlug(slug);

        if (existingRecipe) {
            return Response.json({
                recipe: existingRecipe,
                fromCache: true,
            });
        }

        // ✅ 2️⃣ Validate input
        if (!userPrompt && (!ingredients || ingredients.length === 0)) {
            return Response.json(
                { error: "Either userPrompt or ingredients required" },
                { status: 400 }
            );
        }

        // ✅ 3️⃣ Check usage limit
        const usage = await checkRecipeUsage(user.id);

        if (!usage.allowed) {
            return Response.json(
                { error: "Free limit reached. Upgrade plan." },
                { status: 403 }
            );
        }

        //         // ✅ 4️⃣ Build AI prompt
        let finalPrompt = "";

        const schemaInstruction = `
Return ONLY valid JSON in EXACTLY this structure:

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

All fields are REQUIRED.
Do not omit any field.
If nutrition is unknown, estimate realistic values.
`;

        if (ingredients && ingredients.length > 0) {
            finalPrompt = `
Generate a detailed recipe using ONLY these ingredients:
${ingredients.join(", ")}

You may include common pantry staples.
${schemaInstruction}
`;

            if (source === "scan") {
                finalPrompt += `
The ingredients were detected from an image scan.
Be realistic in quantities and preparation.
`;
            }

        } else {
            finalPrompt = `
Generate a detailed recipe for ${slug.replace(/-/g, " ")}

${schemaInstruction}
`;
        }

        // ✅ 5️⃣ Call AI (or dev mock)
        let aiRecipe;
        let recipeImage = "";
        const isAIEnabled = process.env.AI_ENABLED === "true";

        if (!isAIEnabled) {
            aiRecipe = {
                title: slug.replace(/-/g, " "),
                description: "Dev mode generated recipe.",
                cuisine: "indian",
                category: "dinner",
                ingredients: ["Rice", "Salt"],
                instructions: ["Boil rice", "Serve hot"],
                prepTime: 10,
                cookTime: 20,
                servings: 2,
                nutrition: {
                    fat: "5g",
                    carbs: "40g",
                    protein: "4g",
                    calories: "250 kcal",
                },
                tips: [],
                substitutions: [],
            };
        } else {
            aiRecipe = await generateRecipe(finalPrompt);
            // 🔥 Fetch image from Unsplash
            recipeImage = await fetchRecipeImage(aiRecipe.title);
        }
        if (!aiRecipe?.title) {
            return Response.json(
                { error: "Recipe generation failed" },
                { status: 500 }
            );
        }

        // ✅ 6️⃣ Generate clean slug (NO Date.now)
        const generatedSlug = slugify(slug, {
            lower: true,
            strict: true,
        });

        // ✅ 7️⃣ Normalize for Strapi
        const formattedRecipe = normalizeRecipe(
            aiRecipe,
            generatedSlug,
            user.id,
            recipeImage
        );

        // ✅ 8️⃣ Save to Strapi
        const savedRecipe = await createRecipe(formattedRecipe);

        // ✅ 9️⃣ Increment usage AFTER successful save
        await incrementRecipeUsage(user.id, usage.currentUsage);

        return Response.json({
            recipe: savedRecipe,
            remaining: usage.remaining - 1,
            fromCache: false,
        });

    } catch (error) {
        return Response.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
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
        title: aiRecipe.title || "Untitled Recipe",
        slug,
        description: normalizeDescription(
            aiRecipe.description ||
            `A delicious ${aiRecipe.title} recipe made with simple ingredients.`
        ),
        cuisine: cuisineValue || "default",
        category: categoryValue,
        ingredients: Array.isArray(aiRecipe.ingredients)
            ? aiRecipe.ingredients
            : [],
        instructions: Array.isArray(aiRecipe.instructions)
            ? aiRecipe.instructions
            : [],
        preptime: extractMinutes(aiRecipe.prepTime, 10),
        cooktime: extractMinutes(aiRecipe.cookTime, 20),
        servings: aiRecipe.servings || 2,
        nutrition: normalizeNutrition(aiRecipe.nutrition),
        tips: normalizeStringArray(aiRecipe.tips),
        substitutions: normalizeStringArray(aiRecipe.substitutions),
        imageurl: imageUrl || getCuisineImage(cuisineValue),
        isPublic: true,
        author: userId,
    };
}