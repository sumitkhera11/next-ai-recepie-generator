import Link from "next/link"
import { getTrendingRecipes, getLatestRecipes } from "@/lib/data/recipes";
import { Grid3X3, Globe, Flame, Sparkles } from "lucide-react";
import RecipeSearch from "./RecipeSearch";


export const metadata = {
    title: "Explore Recipes | AI Recipe Generator",
    description:
        "Browse trending recipes, latest dishes, cuisines and categories. Discover delicious meals generated with AI.",
}

export default async function RecipesPage() {

    const trending = await getTrendingRecipes();
    const latest = await getLatestRecipes();

    const categories = [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Dessert",
        "Snacks",
    ]

    const cuisines = [
        "Indian",
        "Italian",
        "Mexican",
        "Chinese",
        "Mediterranean",
    ]

    return (
        <main className="max-w-6xl mx-auto px-4 py-10">

            {/* HEADER */}
            <section className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                    Explore Recipes
                </h1>

                <p className="text-stone-600 max-w-xl mx-auto">
                    Discover trending recipes, latest dishes and explore cuisines from around the world.
                </p>
            </section>

            {/* SEARCH */}
           <RecipeSearch />


            {/* TRENDING RECIPES */}
            <section className="mb-16">

                <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6">
                    <Flame className="w-6 h-6 text-orange-600" />
                    Trending Recipes
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {trending?.map((recipe) => {
                        if (!recipe?.slug) return null;

                        return (
                            <Link
                                key={recipe.id}
                                href={`/recipes/${recipe.slug}`}
                                className="group border border-stone-200 rounded-xl p-4 hover:border-orange-600 hover:shadow-md transition"
                            >
                                <h3 className="font-semibold text-lg transition group-hover:text-orange-600">
                                    {recipe.title}
                                </h3>
                                <p className="text-sm text-stone-500 mt-2 transition group-hover:text-orange-600">
                                    View recipe →
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* LATEST RECIPES */}
            <section className="mb-16">

                <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6">
                    <Sparkles className="w-6 h-6 text-orange-600" />
                    Latest Recipes
                </h2>


                <div className="grid md:grid-cols-3 gap-6">
                    {latest.map((recipe) => (
                        <Link
                            key={recipe.id}
                            href={`/recipes/${recipe.slug}`}
                            className="group border border-stone-200 rounded-xl p-4 hover:border-orange-600 hover:shadow-md transition">
                            <h3 className="font-semibold text-lg transition group-hover:text-orange-600">
                                {recipe.title}
                            </h3>

                            <p className="text-sm text-stone-500 mt-2 transition group-hover:text-orange-600">
                                View recipe →
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="mb-16">

                <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6">
                    <Grid3X3 className="w-6 h-6 text-orange-600" />
                    Browse by Category
                </h2>

                <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                        <Link
                            key={cat}
                            href={`/recipes?category=${cat}`}
                            className="px-4 py-2 bg-stone-100 border border-stone-200 rounded-full text-sm hover:bg-orange-100"
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            </section>

            {/* CUISINES */}
            <section>

                <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6">
                    <Globe className="w-6 h-6 text-orange-600" />
                    Explore Cuisines
                </h2>

                <div className="flex flex-wrap gap-3">
                    {cuisines.map((c) => (
                        <Link
                            key={c}
                            href={`/recipes?cuisine=${c}`}
                            className="px-4 py-2 bg-stone-100 border border-stone-200 rounded-full text-sm hover:bg-orange-100"
                        >
                            {c}
                        </Link>
                    ))}
                </div>
            </section>

        </main>
    )
}
