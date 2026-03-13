import RecipeUI from "@/components/RecipeUI";
import { getRecipeBySlug } from "@/lib/strapi";
import { notFound, redirect } from "next/navigation";
import { checkUserServer } from "@/lib/checkUserServer"


export default async function RecipeDetailPage({ params }) {
    const user = await checkUserServer();
    if (!user) redirect("/sign-in");

    // const { slug } = await params;
    const { slug } =  await params;
    if (!slug) {
       notFound();
    }

    // 🔥 ONLY DB CHECK
    const recipe = await getRecipeBySlug(slug);

    if (!recipe) {
        return <div style={{ backgroundColor: "blue", marginTop: 50, color: "white" }}>Recipe not found</div>;
    }

    return (
        <>
            <RecipeUI
                recipe={recipe}
                fallback="/dashboard"
            />
        </>
    )
}