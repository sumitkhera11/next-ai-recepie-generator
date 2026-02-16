import { currentUser, auth } from "@clerk/nextjs/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function checkUserServer() {
    const clerkUser = await currentUser();
    
    if (!clerkUser) return null;
    console.log("CURRENT USER2:", clerkUser?.id);
    // console.log("STRAPI_123" + user.id);
    // it tells what plan currently user has

    // 1️⃣ Check if user exists in Strapi
    // let strapiUser = await fetchUserFromStrapi(clerkUser.id);

    // 🔹 Determine plan from Clerk
    const { has, sessionClaims } = await auth();

    const clerkPlan =
        sessionClaims?.subscription_status === "active" &&
            has({ plan: "starter_plus" })
            ? "starter_plus"
            : "free";
    // console.log("Clerk Plan11:", clerkPlan);

    // console.log("CLERK ID:", clerkUser.id);
    // console.log(
    //     "FETCH URL:",
    //     `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${clerkUser.id}`
    // );

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
    // console.log("RESPONSE: " + res);
    // console.log("STATUS:", res.status);

if (!res.ok) {
    const errorText = await res.text();
    // console.error("Strapi fetch failed2:", res.status, errorText);
    return null;
}

    // const existingUsers =  await res.json();
    const json = await res.json();
    // console.log("RAW STRAPI RESPONSE:", JSON.stringify(json, null, 2));
    // console.log("Existing Users Found:", existingUsers);
    // const existingUsers = json.data || [];
    const existingUsers = json;
    if (existingUsers.length > 0) {
        // console.log("STRAPI RESPONSE:", existingUsers);

        const existingUser = existingUsers[0];
        // console.log("Strapi Plan:", existingUser.subscriptionTier);


        // 🔹 2️⃣ Sync plan if changed
        if (existingUser.subscriptionTier !== clerkPlan) {
            await fetch(`${STRAPI_URL}/api/users/${existingUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                },
                body: JSON.stringify({
                    subscriptionTier: clerkPlan,
                }),
            });
        }
        return existingUser;
        // return existingUsers[0];

        // return { ...existingUser, subscriptionTier: clerkPlan };
    }

    // Create new user
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
        subscriptionTier: clerkPlan, // Defaut Free
    };

    const createRes = await fetch(`${STRAPI_URL}/api/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify(userData),
    });

    // if (!createRes.ok) {
    //     console.error("User creation failed");
    //     return null;
    // }
    if (!createRes.ok) {
        const errorText = await createRes.text();
        // console.error("User creation failed:", errorText);
        return null;
    }


    return await createRes.json();
}
