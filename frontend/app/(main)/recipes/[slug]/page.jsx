import RecipeUI from "@/components/RecipeUI";
import { getRecipeBySlug } from "@/lib/strapi";
import { notFound, redirect } from "next/navigation";
import { checkUserServer } from "@/lib/checkUserServer"
import {RecipeNotFound} from "@/components/ui/RecipeNotFound"

function mapRecipe(strapiRecipe) {
  const r = strapiRecipe?.attributes || strapiRecipe;

  return {
    id: strapiRecipe.id,
    title: r.title,
    slug : r.slug,
    description: r.description,
    imageurl: r.imageurl,
    ingredients: r.ingredients,
    instructions: r.instructions,
    servings: r.servings,
  };
}

export default async function RecipeDetailPage({ params }) {
    const user = await checkUserServer();
    if (!user) redirect("/sign-in");

    const { slug } = await params;
    if (!slug) {
        notFound();
    }


    // 🔥 ONLY DB CHECK
    const recipeRaw = await getRecipeBySlug(slug);
    const recipe = mapRecipe(recipeRaw?.recipe || {});
    

    if (!recipe) {
        return <RecipeNotFound />
    }
    console.log("RECIPE_DETAIL_PAGE:",recipe)

    return (
        <>
            <RecipeUI
                recipe={recipe}
                fallback="/dashboard"
            />
        </>
    )
}