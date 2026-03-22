
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
export async function getRecipeBySlug(slug) {
    try {
        const res = await fetch(
            `${STRAPI_URL}/api/recipes?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
            { cache: "no-store" }
        );

        if (!res.ok) {
            console.error("Strapi response not ok:", res.status);
            return null;
        }

        const data = await res.json();
        if (!data?.data || data.data.length === 0) {
            return null;
        }
        const r = data.data[0];
        // 🔥 FLATTEN HERE
        const formattedRecipe = {
            id: r.id,
            ...(r.attributes || r) // safety for both cases
        };

        return {
            success: true,
            recipe: formattedRecipe
        };

    } catch (error) {
        console.error("Error fetching recipe:", error);
        return null;
    }
}

export async function createRecipe(recipeData, jwt) {
    // 1. Extract author and other data
    const { author, ...restOfData } = recipeData;

    const createRes = await fetch(`${STRAPI_URL}/api/recipes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
            data: {
                ...restOfData,
                author: author
            }
        }),
    });

    const created = await createRes.json();

    if (!createRes.ok) {
        console.error("Strapi Detail Error:", JSON.stringify(created, null, 2));
        return null;
    }

    // Strapi v5 Draft/Publish: The POST creates a draft. 
    // We use documentId to publish it.
    const documentId = created.data.documentId;

    await fetch(`${STRAPI_URL}/api/recipes/${documentId}/publish`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    });

    return created.data;
}
export async function getSavedRecipes(user) {
    try {
        const url = `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&populate=recipe`;


        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${user.jwt}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("STRAPI ERROR:", errorText);
            throw new Error("Failed to fetch saved recipes");
        }

        const json = await res.json();


        return {
            success: true,
            data: json.data || [],
        };

    } catch (error) {
        console.error("FINAL ERROR:", error);

        return {
            success: false,
            error: error.message || "Something went wrong",
            data: [],
        };
    }
}