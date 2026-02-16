"use client";

// import {  useState } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";

import UserDropDown from "./UserDropDown";
import PricingModal from "./PricingModal";
import { Badge } from "./ui/Badge";

import { Cookie, Refrigerator, Sparkles } from "lucide-react";

export default function Header({ user }) {


    console.log("USER SUBSCRIPTION CURRENT:", user.subscriptionTier);

    // const [user, setUser] = useState(null);

    // useEffect(() => {
    //     fetch("/api/check-user")
    //         .then((res) => res.json())
    //         .then((data) => setUser(data.user))
    //         .catch(console.error);
    // }, []);
    const handleUpgrade = async (newTier) => {
        await fetch("/api/upgrade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newTier }),
        });

        // refresh page to refetch server user
        window.location.reload();
    };

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
                    {user && user.subscriptionTier && (
                        <div className="flex items-center gap-3">

                            <PricingModal
                                subscriptionTier={user.subscriptionTier}
                                onUpgrade={handleUpgrade}
                            >
                                <Badge
                                    variant="outline"
                                    className={`px-3 py-1 text-sm font-semibold rounded-full
                                    ${user.subscriptionTier === "starter_plus"
                                            ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white border-none"
                                            : "bg-gray-900 text-white border-none"
                                        }`}
                                >

                                    <Sparkles className="h-4 w-4 mr-1" />

                                    {user.subscriptionTier === "starter_plus"
                                        ? "Starter Plus"
                                        : "Free Plan"}
                                </Badge>
                            </PricingModal>

                            {/* Debug fallback – remove later if you want */}
                            {/* <span className="text-black font-bold">
        {user.subscriptionTier}
      </span> */}

                        </div>
                    )}

                    <UserDropDown />
                </SignedIn>


            </div>

        </header>
    );
}
