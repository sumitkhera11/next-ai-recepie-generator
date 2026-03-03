import { getOrGenerateRecipe } from "@/actions/recipe.actions";
import RecipeUI from "@/components/RecipeUI";

export default async function RecipeDetailPage({ params }) {
    const { slug } = await params;

    const recipe = await getOrGenerateRecipe(slug);
    console.log("GET_OR_GENERATE_RECIPE:", recipe)

    if (!recipe) {
        return <div style={{backgroundColor:"blue", marginTop:50, color:"white"}}>Recipe not found</div>;
    }

    return <RecipeUI 
        recipe={recipe}
        backLink="/dashboard"
         />;
}