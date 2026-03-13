const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export async function fetchRecipeImage(recipeName) {
    try {
        if (!UNSPLASH_ACCESS_KEY) {
            console.warn("UNSPLASH_ACCESS_KEY missing");
            return "";
        }

        const searchQuery = `${recipeName} food`;

        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                searchQuery
            )}&per_page=1&orientation=landscape&content_filter=high`,
            {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
            }
        );


        if (!response.ok) {
            console.error("Unsplash API error:", response.statusText);
            return "";
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return "";
        }

        return data.results[0].urls.regular;

    } catch (error) {
        console.error("Unsplash fetch error:", error);
        return "";
    }
}
