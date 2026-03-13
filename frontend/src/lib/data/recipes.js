// API Data Layer
const STRAPI_URL = process.env.STRAPI_URL;

export async function getTrendingRecipes() {
    try {
        const res = await fetch(
            `${STRAPI_URL}/api/recipes?populate=*&sort=createdAt:desc&pagination[limit]=8`,
            { next: { revalidate: 60 } }
        );

        const data = await res.json();
        return data?.data ?? [];
    } catch (error) {
        console.error("Trending recipes fetch error:", error);
        return [];
    }

}

export async function getLatestRecipes() {
    try {
        const res = await fetch(
            `${STRAPI_URL}/api/recipes?populate=*&sort=createdAt:desc&pagination[limit]=12`,
            { next: { revalidate: 60 } }
        );

        const data = await res.json();
        return data?.data ?? [];
    } catch (error) {
        console.error("Latest recipes fetch error:", error);
        return [];
    }

}

export async function getCategories() {
    const res = await fetch(`${STRAPI_URL}/categories`, {
        next: { revalidate: 3600 },
    });

    const data = await res.json();
    return data.data;
}

export async function getCuisines() {
    const res = await fetch(`${STRAPI_URL}/cuisines`, {
        next: { revalidate: 3600 },
    });

    const data = await res.json();
    return data.data;
}
