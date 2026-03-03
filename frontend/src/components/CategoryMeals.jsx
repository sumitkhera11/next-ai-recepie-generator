import { getMealsByCategory } from "@/actions/mealdb.actions";
import RecipeGrid from "@/components/RecipeGrid";
import { notFound } from "next/navigation";

export default async function CategoryMeals({ category }) {
    // api calling 
    const data = await getMealsByCategory(category);

   if (!data?.meals) {
    notFound();
  }

  return (
    // <RecipeGrid
    //   type="category"
    //   value={category}
    //   meals={data?.meals || []}
    //   backLink="/dashboard"
    // />
    <RecipeGrid
    type="category"
      meals={data.meals}
      backLink="/dashboard"
    />
  );
}