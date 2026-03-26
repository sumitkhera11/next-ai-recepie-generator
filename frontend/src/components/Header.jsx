"use client";

import Link from "next/link";
import Image from "next/image";
import { Cookie, Refrigerator, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    const isLoggedIn = !!session;

    return (
        <header className="fixed top-0 w-full border-b border-stone-200 
      bg-stone-50/80 backdrop-blur-md z-50">

            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href={isLoggedIn ? "/dashboard" : "/"}>
                    <Image
                        src="/recipion-pro-logo.png"
                        alt="Logo"
                        width={120}
                        height={120}
                        className="w-20 md:w-28 h-auto"
                        priority
                    />
                </Link>

                {/* Center Navigation */}
                <div className="hidden md:flex gap-8 text-sm font-medium">

                    {isLoggedIn && (
                        <>
                            <Link
                                href="/dashboard"
                                className={pathname === "/dashboard" ? "text-orange-600 font-bold" : ""}
                            >
                                Dashboard
                            </Link>

                            <Link href="/saved">❤️ Saved</Link>

                            <Link href="/pantry">
                                <Refrigerator className="inline w-4 h-4 mr-1" />
                                Pantry
                            </Link>
                        </>
                    )}

                    <Link href="/recipes">
                        <Cookie className="inline w-4 h-4 mr-1" />
                        Recipes
                    </Link>

                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">

                    {!isLoggedIn ? (
                        <>
                            <Link href="/sign-in">
                                <Button variant="ghost">Sign In</Button>
                            </Link>

                            <Link href="/sign-up">
                                <Button variant="primary">Get Started</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Badge className="w-fit border-2 border-orange-600 text-orange-600 bg-orange-50 hidden sm:inline-flex">
                                Free Plan
                            </Badge>

                            <Link href="/generate">
                                <Button variant="primary">Generate</Button>
                            </Link>

                            <button onClick={() => signOut({ callbackUrl: "/" })}>
                                Logout
                            </button>
                        </>
                    )}

                </div>
            </nav>
        </header>
    );
}