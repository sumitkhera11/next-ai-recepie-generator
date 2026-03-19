// import { currentUser } from "@clerk/nextjs/server";

// const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
// const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// export async function checkUserServer() {
//   const clerkUser = await currentUser();

//   if (!clerkUser) return null;

//   // 🔹 Always Free in free-mode
//   const defaultPlan = "free";

//   // 🔹 1️⃣ Find user in Strapi by clerkId
//   const res = await fetch(
//     `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${clerkUser.id}`,
//     {
//       headers: {
//         Authorization: `Bearer ${STRAPI_API_TOKEN}`,
//       },
//       cache: "no-store",
//     }
//   );

//   if (!res.ok) {
//     return null;
//   }

//   const existingUsers = await res.json();

//   // 🔹 If user exists → return directly (NO subscription sync)
//   if (existingUsers.length > 0) {
//     return existingUsers[0];
//   }

//   // 🔹 2️⃣ Create new user (Default Free Plan)
//   const rolesRes = await fetch(
//     `${STRAPI_URL}/api/users-permissions/roles`,
//     {
//       headers: {
//         Authorization: `Bearer ${STRAPI_API_TOKEN}`,
//       },
//     }
//   );

//   const rolesData = await rolesRes.json();
//   const authenticatedRole = rolesData.roles.find(
//     (r) => r.type === "authenticated"
//   );

//   if (!authenticatedRole) return null;

//   const userData = {
//     username:
//       clerkUser.username ||
//       clerkUser.emailAddresses[0].emailAddress.split("@")[0],
//     email: clerkUser.emailAddresses[0].emailAddress,
//     password: `clerk_${clerkUser.id}_${Date.now()}`,
//     confirmed: true,
//     blocked: false,
//     role: authenticatedRole.id,
//     clerkId: clerkUser.id,
//     firstName: clerkUser.firstName || "",
//     lastName: clerkUser.lastName || "",
//     imageUrl: clerkUser.imageUrl || "",
//     subscriptionTier: defaultPlan, // Always Free
//   };

//   const createRes = await fetch(`${STRAPI_URL}/api/users`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${STRAPI_API_TOKEN}`,
//     },
//     body: JSON.stringify(userData),
//   });

//   if (!createRes.ok) {
//     return null;
//   }

//   return await createRes.json();
// }
// import { auth } from "@clerk/nextjs/server";
// import { currentUser } from "@clerk/nextjs/server";

// export async function checkUserServer() {
//     // const { userId } = auth();
//       const clerkUser = await currentUser();

//     console.log("STEP 1 Clerk userId:", clerkUser);

//     if (!clerkUser) return null;
//     const userId = clerkUser.id; 

//     try {
//         // STEP 2: fetch from Strapi
//         const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?filters[clerkId][$eq]=${userId}`);

//         const data = await res.json();

//         console.log("STEP 2 Strapi response:", data);

//         if (data?.data?.length > 0) {
//             return data.data[0];
//         }

//         console.log("STEP 3 user not found in DB");

//         return null;

//     } catch (err) {
//         console.log("ERROR in checkUserServer:", err);
//         return null;
//     }
// }
import { currentUser } from "@clerk/nextjs/server";

export async function checkUserServer() {

  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const userId = clerkUser.id;

  try {
    // ✅ STEP 1: check user exists
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users-datas?filters[clerkId][$eq]=${userId}`
    );

    const data = await res.json();

    console.log("STEP 2 Strapi response:", data);

    // ✅ USER FOUND
    if (data?.data?.length > 0) {
      console.log("STEP 3 user already exists");
      return data.data[0];
    }

    // 🔥 🔴 NEW CODE START (AUTO CREATE USER)
    console.log("STEP 3 Creating new user...");

    const createRes = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users-datas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`,
          },
        }),
      }
    );
    // ✅ IMPORTANT DEBUG ADD
    const text = await createRes.text();

    if (!createRes.ok) {
      console.error("CREATE ERROR RAW:", text);
      throw new Error("User creation failed");
    }
    const newUser = JSON.parse(text);
    console.log("STEP 4 Created user:", newUser);

    return newUser.data;
    // 🔴 NEW CODE END

  } catch (err) {
    console.error("ERROR:", error);
    return null;
  }
}