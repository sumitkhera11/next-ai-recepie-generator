"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SyncUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {

    // Debugging start
    console.log("SYNC USER COMPONENT LOADED");
    console.log("isLoaded:", isLoaded);
    console.log("User object:", user);
    console.log("User ID:", user?.id);
    // Debugging end

    if (!isLoaded || !user) return;

    const syncUser = async () => {
      try {

        console.log("SYNC USER RUNNING");
        console.log("Sending clerkId:", user.id);

        await fetch(
          "https://next-ai-recepie-generator.onrender.com/api/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                username: user.username || user.firstName,
                email: user.emailAddresses[0].emailAddress,
                clerkId: user.id,
              },
            }),
          }
        );

        console.log("User sync request sent");

      } catch (error) {
        console.log("Sync failed", error);
      }
    };

    syncUser();

  }, [user, isLoaded]);

  return null;
}