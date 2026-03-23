"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Cookie, Refrigerator, Sparkles } from "lucide-react";
import UserDropDown from "./UserDropDown";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { usePathname } from "next/navigation";

export default function Header({ userId }) {
   
    const pathname = usePathname();

    return (
        <header className="fixed top-0 w-full border-b border-stone-200 
      bg-stone-50/80 backdrop-blur-md z-50 
      supports-backdrop-filter:bg-stone-50/60">

            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href={userId ? "/dashboard" : "/"}>
                    <Image
                        src="/recipion-pro-logo.png"
                        alt="Recipion AI Recipe Generator Logo"
                        width={120}
                        height={120}
                        className="w-20 md:w-28 h-auto"
                        priority
                        sizes="(max-width:768px) 80px, 120px"
                    />
                </Link>

                {/* Center Navigation */}
                <div className="hidden md:flex gap-8 text-sm font-medium">

                    {/* Dashboard */}
                    <SignedIn>
                        <Link
                            href="/dashboard"
                            className={`flex gap-1.5 items-center hover:text-orange-600 transition-colors ${pathname === "/dashboard" ? "text-orange-600 font-bold" : ""
                                }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            Dashboard
                        </Link>
                        {/* Saved */}
                        <Link
                            href="/saved"
                            className={`flex gap-1.5 items-center hover:text-orange-600 transition-colors ${pathname === "/saved" ? "text-orange-600 font-bold" : ""
                                }`}
                        >
                            ❤️ Saved
                        </Link>
                        {/* Pantry */}
                        <Link
                            href="/pantry"
                            className={`flex gap-1.5 items-center hover:text-orange-600 transition-colors ${pathname === "/pantry" ? "text-orange-600 font-bold" : ""
                                }`}
                        >
                            <Refrigerator className="w-4 h-4" />
                            My Pantry
                        </Link>
                    </SignedIn>
                    {/* Recipes */}
                    <Link
                        href="/recipes"
                        className={`flex gap-1.5 items-center hover:text-orange-600 transition-colors ${pathname.startsWith("/recipes") ? "text-orange-600 font-bold" : ""
                            }`}
                    >
                        <Cookie className="w-4 h-4" />
                        Recipes
                    </Link>





                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">

                    <SignedOut>
                        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                            <Button variant="ghost">Sign In</Button>
                        </SignInButton>

                        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                            <Button variant="primary">Get Started</Button>
                        </SignUpButton>
                    </SignedOut>

                    <SignedIn>
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
                                <Sparkles className="w-4 h-4" />
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

