import { checkUserServer } from "@/lib/checkUserServer";

const STRAPI_URL = process.env.STRAPI_URL;
// const FREE_LIMIT = 5;

export async function checkRecipeUsage() {

    const user = await checkUserServer();

    if (!user) {
        return { allowed: false };
    }
    const today = new Date().toISOString().slice(0, 10);

    const res = await fetch(`${STRAPI_URL}/users/${user.id}`);
    const strapiUser = await res.json();

    let dailyRecipeUsage = strapiUser.dailyRecipeUsage || 0;
    let lastUsageDate = strapiUser.lastUsageDate;

    if (lastUsageDate !== today) {
        dailyRecipeUsage = 0;
    }

    if (dailyRecipeUsage >= FREE_LIMIT) {
        return {
            allowed: false,
            currentUsage: dailyRecipeUsage,
            remaining: 0,
        };
    }

    return {
        allowed: true,
        currentUsage: dailyRecipeUsage,
        remaining: FREE_LIMIT - dailyRecipeUsage,
    };
}
export async function incrementRecipeUsage(currentUsage) {
    const user = await checkUserServer();

    if (!user) {
        return { success: false };
    }
    const today = new Date().toISOString().slice(0, 10);

    await fetch(`${STRAPI_URL}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            dailyRecipeUsage: currentUsage + 1,
            lastUsageDate: today,
        }),
    });
}