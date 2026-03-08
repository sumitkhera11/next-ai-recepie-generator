import { currentUser } from "@clerk/nextjs/server";

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function checkUserServer() {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  // 🔹 Always Free in free-mode
  const defaultPlan = "free";

  // 🔹 1️⃣ Find user in Strapi by clerkId
  const res = await fetch(
    `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${clerkUser.id}`,
    {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  const existingUsers = await res.json();

  // 🔹 If user exists → return directly (NO subscription sync)
  if (existingUsers.length > 0) {
    return existingUsers[0];
  }

  // 🔹 2️⃣ Create new user (Default Free Plan)
  const rolesRes = await fetch(
    `${STRAPI_URL}/api/users-permissions/roles`,
    {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
    }
  );

  const rolesData = await rolesRes.json();
  const authenticatedRole = rolesData.roles.find(
    (r) => r.type === "authenticated"
  );

  if (!authenticatedRole) return null;

  const userData = {
    username:
      clerkUser.username ||
      clerkUser.emailAddresses[0].emailAddress.split("@")[0],
    email: clerkUser.emailAddresses[0].emailAddress,
    password: `clerk_${clerkUser.id}_${Date.now()}`,
    confirmed: true,
    blocked: false,
    role: authenticatedRole.id,
    clerkId: clerkUser.id,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    imageUrl: clerkUser.imageUrl || "",
    subscriptionTier: defaultPlan, // Always Free
  };

  const createRes = await fetch(`${STRAPI_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify(userData),
  });

  if (!createRes.ok) {
    return null;
  }

  return await createRes.json();
}
