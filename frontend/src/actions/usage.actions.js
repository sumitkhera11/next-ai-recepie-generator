import { calculateUsage } from "@/lib/usage/checkUsage";
import { FREE_LIMIT } from "@/lib/constants/limits";
import { authGuardAPI } from "@/lib/authGuardAPI";


const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
// const FREE_LIMIT = 5;

export async function checkRecipeUsage() {
  const user = await authGuardAPI();
  if (user.error) {
    return { success: false, error: user.error };
  }

  const res = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  const strapiUser = await res.json();

  return calculateUsage(
    strapiUser.dailyRecipeUsage || 0,
    strapiUser.lastUsageDate,
    FREE_LIMIT
  );
}

export async function incrementRecipeUsage() {
  const user = await authGuardAPI();

  if (user.error) {
    return { success: false, error: user.error };
  }

  try {
    // 1. Get current usage
    const res = await fetch(
      `${STRAPI_URL}/api/users/${user.userId}`,
      {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    const today = new Date().toLocaleDateString("en-CA");
    const lastDate = data.lastUsageDate;

    let usage = data.dailyRecipeUsage || 0;

    // 2. reset if new day
    if (lastDate !== today) {
      usage = 0;
    }

    // 3. increment
    const newUsage = usage + 1;

    await fetch(`${STRAPI_URL}/api/users/${user.userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.jwt}`,
      },
      body: JSON.stringify({
        dailyRecipeUsage: newUsage,
        lastUsageDate: today,
      }),
    });

    return { success: true, usage: newUsage };

  } catch (err) {
    console.error("Usage increment error:", err);
    return { success: false };
  }
}