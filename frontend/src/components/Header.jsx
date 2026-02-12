"use client";

import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Button from "@/components/ui/Button";

import UserDropDown from "./UserDropDown";
import PricingModal from "./PricingModal";
import { Badge } from "./ui/Badge";

export default function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("/api/check-user")
            .then((res) => res.json())
            .then((data) => setUser(data.user))
            .catch(console.error);
    }, []);

    return (
        <header className="flex justify-between items-center p-4 border-b">
            <div className="text-xl font-bold">Next AI Recipe</div>

            <SignedIn>
                {user?.subscriptionTier && (
                    <PricingModal subscriptionTier={user.subscriptionTier}>
                        <Badge
                            className={
                                user.subscriptionTier === "starter_plus"
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-400 text-white"
                            }
                        >
                            {user.subscriptionTier === "starter_plus"
                                ? "Starter Plus"
                                : "Free Plan"}
                        </Badge>
                    </PricingModal>

                )}
                <UserDropDown />
            </SignedIn>

            <SignedOut>
                <SignInButton />
                <SignUpButton />
            </SignedOut>
        </header>
    );
}
