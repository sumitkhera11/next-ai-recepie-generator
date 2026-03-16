"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SyncUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      try {
        const email = user.emailAddresses[0].emailAddress;
        const clerkId = user.id;
        const username = user.firstName || "user";

        console.log("Checking user in Strapi...");

        // 1️⃣ Check if user already exists
        const checkRes = await fetch(
          `https://next-ai-recepie-generator.onrender.com/api/users?filters[clerkId][$eq]=${clerkId}`
        );

        const existingUsers = await checkRes.json();

        if (existingUsers.length > 0) {
          console.log("User already exists in Strapi");
          return;
        }

        console.log("Creating new user in Strapi...");

        // 2️⃣ Create new user
        const createRes = await fetch(
          "https://next-ai-recepie-generator.onrender.com/api/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              email: email,
              password: crypto.randomUUID(),
              provider: "clerk",
              confirmed: true,
              blocked: false,
              role: 1, // 👈 Authenticated role
              clerkId: clerkId
            }),
          }
        );

        const data = await createRes.json();

        console.log("Strapi response:", data);

      } catch (error) {
        console.error("User sync failed:", error);
      }
    };

    syncUser();
  }, [user, isLoaded]);

  return null;
}