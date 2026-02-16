"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import UserDropDown from "./UserDropDown";
import { Badge } from "./ui/Badge";
import { Sparkles } from "lucide-react";

export default function Header({ user }) {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div className="text-xl font-bold">Next AI Recipe</div>

      <div className="flex gap-6">
        <a href="/recipes" className="text-gray-600 hover:text-black">
          Recipes
        </a>
        <a href="/dashboard" className="text-gray-600 hover:text-black">
          Dashboard
        </a>
      </div>

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
          {user && (
            <Badge className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-900 text-white border-none">
              <Sparkles className="h-4 w-4 mr-1" />
              Free Plan
            </Badge>
          )}

          <UserDropDown />
        </SignedIn>
      </div>
    </header>
  );
}
