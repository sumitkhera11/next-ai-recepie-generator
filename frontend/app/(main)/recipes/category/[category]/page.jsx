// page.jsx (Server Component)

// http://localhost:3000/recipes/category/starter
// URL
//   ↓
// page.jsx (Server)
//   ↓
// getMealsByCategory (Server)
//   ↓
// RecipeGrid (Server)
//   ↓
// HTML render
// Your final clean architecture should be:
// page.jsx → routing + suspense
// CategoryMeals.jsx → data fetching
// RecipeGrid.jsx → pure UI (server)
// loading.jsx → route fallback
// error.jsx → error boundary
// not-found.jsx → invalid category

// import {getMealsByCategory } from "@/actions/mealdb.actions"
// import RecipeGrid from  '@/components/RecipeGrid'

// export default async function CategoryRecipesPage({params}) {

//     const resolvedParams = await params;
//     const category = resolvedParams.category;
//     const data = await getMealsByCategory(category);
    
//     return (
//         <RecipeGrid
//             type="category"
//             value={category}
//             meals={data?.meals || []}
//             backLink = "/dashboard"/>
//     )
// }
import { Suspense } from "react";
import CategoryMeals from "@/components/CategoryMeals";
import Loader from "@/components/ui/Loader";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const displayName = category.replace(/-/g, " ");

  return {
    title: `${displayName} Recipes | Next AI Recipe Generator`,
    description: `Explore delicious ${displayName} recipes with step-by-step cooking instructions.`,
  };
}

export default async function CategoryRecipesPage({ params }) {
  const { category } = await params;
  const displayName = category.replace(/-/g, " ");
  
  return (
    <div className="min-h-screen bg-stone-50 pt-14 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">

        {/* Header instantly render hoga */}  {/* ✅ SEO Main H1 */}
        <h1 className="text-5xl md:text-6xl font-bold text-stone-900 capitalize tracking-tight leading-tight mb-8">
          {displayName} <span className="text-orange-600">Recipes</span>
        </h1>

        {/* Meals section streamed separately */}
        <Suspense fallback={<Loader text="Loading recipes..." />}>
          <CategoryMeals category={category} />
        </Suspense>
      </div>
    </div>
  );
}