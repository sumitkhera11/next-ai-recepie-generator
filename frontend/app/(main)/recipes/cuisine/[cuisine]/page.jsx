import { Suspense } from "react";
import CuisineMeals from "@/components/CuisineMeals";
import Loader from "@/components/ui/Loader";

// Concern	    Handled At
// SEO	        page.jsx
// Streaming	page.jsx
// Data Fetch	CuisineMeals
// UI	        RecipeGrid

export async function generateMetadata({ params }) {
  const { cuisine } = await params;
  const displayName = cuisine.replace(/-/g, " ");

  return {
    title: `${displayName} Cuisine Recipes | Next AI Recipe Generator`,
    description: `Explore authentic ${displayName} cuisine recipes with step-by-step cooking instructions.`,
  };
}

export default async function CuisineRecipesPage({ params }) {
  const { cuisine } =  await params;
  
  const displayName = cuisine.replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-stone-50 pt-14 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">

        {/* SEO H1 */}
        <h1 className="text-5xl md:text-6xl font-bold text-stone-900 capitalize tracking-tight leading-tight mb-8">
          {displayName} <span className="text-orange-600">Cuisine</span>
        </h1>

        {/* Streaming */}
        <Suspense fallback={<Loader text="Loading cuisines..." />}>
          <CuisineMeals cuisine={cuisine} />
        </Suspense>

      </div>
    </div>
  );
}