const STRAPI_URL = process.env.STRAPI_URL;
const FREE_LIMIT = 5;

export async function checkScanUsage(userId) {
    const today = new Date().toISOString().slice(0, 10);
    const res = await fetch(`${STRAPI_URL}/users/${userId}`);
    const user = await res.json();

    let dailyScanUsage = user.dailyScanUsage || 0;
    let lastUsageDate = user.lastUsageDate;

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
    // free tier pantry scan limits(10 scans per month)

    // free tier meal recommendation ()10 scans per month)
}

export async function incrementScanUsage(userId, currentUsage) {
    const today = new Date().toISOString().slice(0, 10);

    await fetch(`${STRAPI_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            dailyScanUsage: currentUsage + 1,
            lastUsageDate: today,
        }),
    });
}