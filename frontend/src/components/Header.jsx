"use client";

import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";

import UserDropDown from "./UserDropDown";
import PricingModal from "./PricingModal";
import { Badge } from "./ui/Badge";

import { Cookie, Refrigerator, Sparkles } from "lucide-react";

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
            {/* CENTER: Navigation Links */}
            <div className="flex gap-6">
                <a href="/recipes" className="text-gray-600 hover:text-black">
                    Recipes
                </a>
                <a href="/dashboard" className="text-gray-600 hover:text-black">
                    Dashboard
                </a>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-3">

                <SignedOut>
                    <SignInButton mode="modal">
                        <Button variant="ghost">Sign In</Button>
                    </SignInButton>

                    <SignUpButton mode="modal">
                        <Button variant="primary">Get Started</Button>
                    </SignUpButton>
                </SignedOut>

                <SignedIn>
                    {user?.subscriptionTier && (
                        <PricingModal subscriptionTier={user.subscriptionTier}
                        onUpgrade={(newTier) => setUser({ ...user, subscriptionTier: newTier })}>
                            <Badge
                                className={
                                    user.subscriptionTier === "starter_plus"
                                        ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white"
                                        : "bg-gray-100 text-gray-700"
                                }
                            >
                                <Sparkles className="h-3 w-3 mr-1" />
                                {user.subscriptionTier === "starter_plus"
                                    ? "Starter Plus"
                                    : "Free Plan"}
                            </Badge>
                        </PricingModal>
                    )}

                    <UserDropDown />
                </SignedIn>

            </div>

        </header>
    );
}
