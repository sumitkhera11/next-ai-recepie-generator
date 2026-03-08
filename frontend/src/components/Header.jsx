"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Cookie, Refrigerator, Sparkles } from "lucide-react";
import UserDropDown from "./UserDropDown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header({ userId }) {
    return (
        <header className="fixed top-0 w-full border-b border-stone-200 
      bg-stone-50/80 backdrop-blur-md z-50 
      supports-backdrop-filter:bg-stone-50/60">

            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href={userId ? "/dashboard" : "/"}>
                    <Image
                        src="/orange-logo.png"
                        alt="Recipion Logo"
                        width={60}
                        height={60}
                        className="w-16"
                        priority
                    />
                </Link>

                {/* Center Navigation */}
                <div className="hidden md:flex gap-8 text-sm font-medium">
                    <Link href="/recipes" className="hover:text-orange-600 transition-colors flex gap-1.5 items-center">
                        <Cookie className="w-4 h-4" />
                        Recipes
                    </Link>
                    <Link href="/pantry" className="hover:text-orange-600 transition-colors flex gap-1.5 items-center">
                        <Refrigerator className="w-4 h-4" />
                        My Pantry
                    </Link>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">

                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="ghost">Sign In</Button>
                        </SignInButton>

                        <SignUpButton mode="modal">
                            <Button variant="primary">Get Started</Button>
                        </SignUpButton>
                    </SignedOut>

                    <SignedIn>
                        {userId && (
                            <Badge
                                className="hidden sm:inline-flex items-center
                 px-4 py-1.5
                 text-sm font-semibold
                 rounded-full
                 border border-orange-500/30
                 bg-orange-50
                 text-orange-600!
                 backdrop-blur-sm"
                            >
                                <Sparkles className="h-4 w-4 mr-2 text-orange-500!" />
                                Free Plan
                            </Badge>
                        )}
<Link href="/generate">
<Button
className="
bg-orange-600
hover:bg-orange-700
text-white
px-4
py-2
rounded-lg
hidden md:flex
items-center
gap-2
"
>
<Sparkles className="w-4 h-4"/>
Generate
</Button>
</Link>

                        <UserDropDown />
                    </SignedIn>


                </div>
            </nav>
        </header>
    );
}

