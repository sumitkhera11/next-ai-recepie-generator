// CuisineMeals Component (Data Layer)
import { getMealsByCuisine } from "@/actions/mealdb.actions";
import RecipeGrid from "@/components/RecipeGrid";
import { notFound } from "next/navigation";

export default async function CuisineMeals({ cuisine }) {
  const data = await getMealsByCuisine(cuisine);

  if (!data?.meals) {
    notFound();
  }

  return (
    <RecipeGrid
     type="cuisine"
      meals={data.meals}
      backLink="/dashboard"
    />
  );
}