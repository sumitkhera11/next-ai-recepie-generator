const STRAPI_URL = process.env.STRAPI_URL;
const FREE_LIMIT = 5;

// export async function checkRecipeUsage(userId) {
export async function checkRecipeUsage(userId) {
  const today = new Date().toISOString().slice(0, 10);

  const res = await fetch(`${STRAPI_URL}/users/${7}`);
  const user = await res.json();

  let dailyRecipeUsage = user.dailyRecipeUsage || 0;
  let lastUsageDate = user.lastUsageDate;

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
export async function incrementRecipeUsage(userId, currentUsage) {
  const today = new Date().toISOString().slice(0, 10);

  await fetch(`${STRAPI_URL}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dailyRecipeUsage: currentUsage + 1,
      lastUsageDate: today,
    }),
  });
}