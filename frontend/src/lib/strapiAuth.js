// lib/strapiAuth.js
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// lib/strapiAuth.js

export async function syncUserWithStrapi({ email, clerkId, username }) {
    console.log("SYNC_USER_INPUT:", { email, clerkId, username });
    try {
        // 1️⃣ Check if user already exists (by clerkId)
        const checkRes = await fetch(
            `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${clerkId}`,
            {
                headers: {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`, 
                },
                cache: "no-store",
            }
        );

        const checkExistingData = await checkRes.json();

        if (checkExistingData && checkExistingData.length > 0) {
            return checkExistingData[0]; // ✅ already exists
        }
        console.log("syncUserExisting_Response", checkExistingData)
        // 2️⃣ Create new user in Strapi
        const createRes = await fetch(`${STRAPI_URL}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${STRAPI_API_TOKEN}`, // ✅ required
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: `Clerk@123456`, 
                provider: "clerk",
                confirmed: true,
                blocked: false,
                role: 1, // usually authenticated role
                clerkId: clerkId, // 🔥 important for future lookup
            }),
        });

        const newUser = await createRes.json();
        console.log("NEW_USER_RESPONSE:",newUser)

        return newUser;

    } catch (error) {
        console.error("SYNC USER ERROR:", error);
        return null;
    }
}
export async function getStrapiJWT(email) {
    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            identifier: email,
            password: "Clerk@123456", 
        }),
    });

    const data = await res.json();

    console.log("JWT RESPONSE:", data);

    if (!res.ok) {
        console.log("❌ JWT ERROR:", data);
        return null;
    }

    return data.jwt;
}