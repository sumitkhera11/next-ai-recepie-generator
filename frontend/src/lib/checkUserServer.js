// lib/checkUserServer.js

import { auth,currentUser } from "@clerk/nextjs/server";
import { syncUserWithStrapi, getStrapiJWT } from "./strapiAuth";

export async function checkUserServer() {

    try {

      const { userId } = auth();

        if (!userId) {
            console.log("❌ Clerk user not found");
            // return null;
        }
        // 🔥 1. Get Clerk user
        const clerkUser = await currentUser();

        if (!clerkUser) {
            console.log("❌ currentUser() returned null");
            return null;
        }

        console.log("✅ Clerk user:", clerkUser);

        // 🔥 2. Extract details
        const email = clerkUser.emailAddresses?.[0]?.emailAddress;
        const clerkId = clerkUser.id;

        const username =
            clerkUser.username ||
            clerkUser.firstName ||
            email?.split("@")[0] ||
            "user";

        if (!email) {
            console.log("❌ Email not found in Clerk user");
            return null;
        }

        // 🔥 3. Sync user to Strapi
        const strapiUser = await syncUserWithStrapi({
            email,
            clerkId,
            username,
        });

        if (!strapiUser) {
            console.log("❌ Strapi user sync failed");
            return null;
        }

        console.log("✅ STRAPI USER:", strapiUser);

        // 🔥 4. Get JWT from Strapi
        const jwt = await getStrapiJWT(email);

        if (!jwt) {
            console.log("❌ JWT generation failed");
            return null;
        }

        // 🔥 5. FINAL RETURN
        return {
            id: strapiUser.id,
            jwt,
            email,
            clerkId,
        };

    } catch (error) {
        console.error("❌ checkUserServer ERROR:", error);
        return null;
    }
}