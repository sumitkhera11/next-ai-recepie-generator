
export async function getRecipeBySlug(slug) {
  try {
    const res = await fetch(
      `${process.env.STRAPI_URL}/api/recipes?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
      { cache: "no-store" }
    );

    const data = await res.json();

    if (!data?.data || data.data.length === 0) {
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }
}
// export async function createRecipe(recipeData) {
//     const res = await fetch(`${process.env.STRAPI_URL}/api/recipes`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//             // Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
//         },
//          body: JSON.stringify({
//             data: {
//                 ...recipeData,
//                 publishedAt: new Date().toISOString() 
//             }
//         }),
//     });

//     const data = await res.json();
//     console.log("1.STRAPI_CREATE:",JSON.stringify(data, null, 2))
//     if (!res.ok) {
//         console.error("Strapi Error:", data);
//         return null;
//     }
//     return data.data;   
// }
export async function createRecipe(recipeData) {
    // Step 1: Create draft
    const createRes = await fetch(`${process.env.STRAPI_URL}/api/recipes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: recipeData }),
    });

    const created = await createRes.json();

    if (!createRes.ok) {
        console.error("Create Error:", created);
        return null;
    }

    const documentId = created.data.documentId;

    // Step 2: Publish it
    await fetch(`${process.env.STRAPI_URL}/api/recipes/${documentId}/publish`, {
        method: "POST",
    });

    return created.data;
}