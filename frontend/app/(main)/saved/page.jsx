import { removeRecipeFromCollection } from "@/actions/recipe.actions";

import { getSavedRecipes } from "@/lib/strapi";
import { checkUserServer } from "@/lib/checkUserServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LIMITS } from "@/lib/constants/limits";
import SavedRecipeCard from "@/components/SavedRecipeCard";

export const dynamic = "force-dynamic";


export default async function SavedRecipesPage() {
    const user = await checkUserServer();
    if (!user) redirect("/sign-in");

    const result = await getSavedRecipes(user);

    // ✅ HANDLE ERROR FIRST
    if (!result.success) {
        return (
            <div className="text-red-500">
                Error: {result.error}
            </div>
        );
    }


    // ✅ SAFE DATA ACCESS
    const savedRecipes = result.data;
    const LIMIT = LIMITS.FREE.SAVED_RECIPES;
    const isLimitReached = savedRecipes.length >= LIMIT;



    return (
        <div className="max-w-6xl mx-auto px-4 py-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                {/* Left Side */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Saved Recipes
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Your personal collection 🍳
                    </p>
                </div>

                {/* Right Side Card */}
                <div className="flex items-center gap-3 bg-gray-50 border px-4 py-3 rounded-xl shadow-sm">

                    {/* Count */}
                    <div className="text-right">
                        <p className="text-sm text-gray-500">
                            Usage
                        </p>
                        <p className="text-lg font-semibold">
                            {savedRecipes.length}/{LIMIT}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${isLimitReached ? "bg-red-500" : "bg-green-500"
                                }`}
                            style={{
                                width: `${(savedRecipes.length / LIMIT) * 100}%`,
                            }}
                        />
                    </div>

                    {/* Badge */}
                    <div>
                        {isLimitReached ? (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                Limit reached
                            </span>
                        ) : (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                Free Plan
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {savedRecipes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <h2 className="text-2xl font-semibold mb-2">
                        No saved recipes yet 🍳
                    </h2>
                    <p className="text-gray-500 mb-4">
                        Start exploring and save your favorite recipes
                    </p>
                    <Link
                        href="/generate"
                        className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-90"
                    >
                        Generate Recipe
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {savedRecipes.map((item) => (
                        <SavedRecipeCard
                            key={item.id}
                            item={item}
                            jwt={user.jwt} // ✅ IMPORTANT
                        />
                    ))}
                </div>
            )}
        </div>
    );
}