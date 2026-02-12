import { currentUser, auth } from "@clerk/nextjs/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function checkUserServer() {
    const user = await currentUser();
    
    if (!user) return null;
    console.log("STRAPI_123" + user.id);

    const { has, sessionClaims } = await auth();

    const clerkPlan =
        sessionClaims?.subscription_status === "active" &&
            has({ plan: "starter_plus" })
            ? "starter_plus"
            : "free";
    console.log("Clerk Plan:", clerkPlan);

    // Check if user exists in Strapi
    const res = await fetch(
        `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${user.id}`,
        {
            headers: {
                Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        console.error("Strapi fetch failed");
        return null;
    }

    const existingUsers = await res.json();
    console.log("Existing Users Found:", existingUsers);

    if (existingUsers.length > 0) {
        const existingUser = existingUsers[0];
        console.log("Strapi Plan:", existingUser.subscriptionTier);


        // Update subscription if needed
        // if (existingUser.subscriptionTier !== clerkPlan) {
        //     await fetch(`${STRAPI_URL}/api/users/${existingUser.id}`, {
        //         method: "PUT",
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        //         },
        //         body: JSON.stringify({
        //             subscriptionTier: clerkPlan,
        //         }),
        //     });
        // }
        return existingUser;

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
            user.username ||
            user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        password: `clerk_${user.id}_${Date.now()}`,
        confirmed: true,
        blocked: false,
        role: authenticatedRole.id,
        clerkId: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        imageUrl: user.imageUrl || "",
        subscriptionTier: clerkPlan,
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
        console.error("User creation failed");
        return null;
    }

    return await createRes.json();
}
