import { checkUserServer } from "@/lib/checkUserServer";
import { calculateUsage } from "@/lib/usage/checkUsage";
import { FREE_LIMIT } from "@/lib/constants/limits";


const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
// const FREE_LIMIT = 5;

export async function checkRecipeUsage() {

    const user = await checkUserServer();
    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const res = await fetch(`${STRAPI_URL}/users/${user.id}`, {
        headers: {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
    });
    const strapiUser = await res.json();

    return calculateUsage(
        strapiUser.dailyRecipeUsage || 0,
        strapiUser.lastUsageDate,
        FREE_LIMIT
    );
}
export async function incrementRecipeUsage(currentUsage) {

  const user = await checkUserServer();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const today = new Date().toLocaleDateString("en-CA");

  await fetch(`${process.env.STRAPI_URL}/users/${user.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dailyRecipeUsage: currentUsage + 1,
      lastUsageDate: today,
    }),
  });

  return { success: true };
}