"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SyncUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      try {
        await fetch(
          "https://next-ai-recepie-generator.onrender.com/api/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              data: {
                username: user.username || user.firstName,
                email: user.emailAddresses[0].emailAddress,
                clerkId: user.id
              }
            })
          }
        );
      } catch (err) {
        console.log("User sync failed", err);
      }
    };

    syncUser();
  }, [user, isLoaded]);

  return null;
}