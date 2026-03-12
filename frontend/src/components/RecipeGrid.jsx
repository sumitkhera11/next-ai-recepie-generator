"use client"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import EmptyState from "@/components/ui/EmptyState";
import RecipeCard from "@/components/RecipeCard"

function RecipeGrid({ type, meals, backLink }) {
    const typeConfig = {
        category: {
            emptyTitle: "No recipes found",
            emptyDescription: "Try exploring other categories.",
        },
        cuisine: {
            emptyTitle: "No cuisine dishes found",
            emptyDescription: "Try exploring other cuisines.",
        },
    };
    const config = typeConfig[type] || typeConfig.category;

    return (
        <>
            <div className="mb-6">
                <Link
                    href={backLink}
                    className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors"

                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>

            {meals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {meals.map((meal, index) => (
                        <RecipeCard
                            key={meal.idMeal}
                            recipe={meal}
                            variant="grid"
                            priority={index === 0}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title={config.emptyTitle}
                    description={config.emptyDescription}
                    backLink={backLink}
                    backText="Go back to explore more"
                />
            )}
        </>
    );
}

export default RecipeGrid;