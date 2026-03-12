import { getOrGenerateRecipe } from "@/actions/recipe.actions"
import { redirect } from "next/navigation"
import { ChefHat, Clock, Brain } from "lucide-react"
import GenerateButton from "@/components/GenerateButton"
import { checkUserServer } from "@/lib/checkUserServer"


// ----------------------
// Server Action
// ----------------------
async function generateRecipe(formData) {
    "use server"
    const user = await checkUserServer();
    if (!user) redirect("/");

    const rawInput = formData.get("slug")

    if (!rawInput) return

    const slug = rawInput
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")

    const recipe = await getOrGenerateRecipe(slug)
    if (!recipe) return
    redirect(`/recipes/${recipe.slug}`)
}

// ----------------------
// Page UI
// ----------------------

export const metadata = {
    title: "AI Recipe Generator - Create Recipes Instantly",
    description:
        "Generate delicious recipes instantly using AI. Enter ingredients or dish name and get a full recipe with instructions, nutrition, and cooking tips.",
}

export default async function GeneratePage() {
    const user = await checkUserServer();
    if (!user) {
        redirect("/sign-in")
    }

    return (
        <div className="min-h-screen bg-stone-50 px-4 pt-28 pb-20">

            {/* HERO */}
            <section className="max-w-4xl mx-auto text-center mb-16">

                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    AI Recipe Generator
                </h1>

                <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                    Type any dish name or ingredients and let AI generate a
                    complete recipe with ingredients, instructions,
                    cooking time, and nutrition instantly.
                </p>

            </section>


            {/* GENERATOR CARD */}
            <section className="max-w-2xl mx-auto">
                <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
                    <form action={generateRecipe} className="flex flex-col sm:flex-row gap-4">
                        <input
                            name="slug"
                            placeholder="e.g. butter chicken, paneer tikka, pasta"
                            className="flex-1 border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                        <GenerateButton />
                    </form>
                </div>
            </section>


            {/* EXAMPLE PROMPTS */}
            <section className="max-w-3xl mx-auto mt-10 text-center">

                <p className="text-sm text-stone-500 mb-3">
                    Try examples
                </p>

                <div className="flex flex-wrap justify-center gap-3">

                    {[
                        "butter chicken",
                        "vegan pasta",
                        "paneer tikka",
                        "chicken biryani",
                        "quick breakfast eggs"
                    ].map((item) => (

                        <span
                            key={item}
                            className="px-4 py-2 text-sm bg-stone-100 border border-stone-200 rounded-full"
                        >
                            {item}
                        </span>

                    ))}

                </div>

            </section>


            {/* HOW AI WORKS */}
            <section className="max-w-5xl mx-auto mt-24">

                <h2 className="text-3xl font-bold text-center mb-12">
                    How AI Recipe Generator Works
                </h2>

                <div className="grid md:grid-cols-3 gap-8">

                    <div className="text-center">
                        <ChefHat className="mx-auto mb-4 w-8 h-8 text-orange-500" />
                        <h3 className="font-semibold text-lg mb-2">
                            Enter Dish Name
                        </h3>
                        <p className="text-stone-600 text-sm">
                            Type any recipe name or ingredients you have in your kitchen.
                        </p>
                    </div>

                    <div className="text-center">
                        <Brain className="mx-auto mb-4 w-8 h-8 text-orange-500" />
                        <h3 className="font-semibold text-lg mb-2">
                            AI Generates Recipe
                        </h3>
                        <p className="text-stone-600 text-sm">
                            Our AI creates a full recipe including ingredients,
                            steps, tips and nutrition.
                        </p>
                    </div>

                    <div className="text-center">
                        <Clock className="mx-auto mb-4 w-8 h-8 text-orange-500" />
                        <h3 className="font-semibold text-lg mb-2">
                            Cook Instantly
                        </h3>
                        <p className="text-stone-600 text-sm">
                            Follow the instructions and cook delicious meals instantly.
                        </p>
                    </div>

                </div>

            </section>


            {/* SEO CONTENT */}
            <section className="max-w-3xl mx-auto mt-24 text-center">

                <h2 className="text-3xl font-bold mb-6">
                    Generate Unlimited Recipes with AI
                </h2>

                <p className="text-stone-600 leading-relaxed">
                    Our AI powered recipe generator helps you create delicious meals
                    from any ingredients. Whether you want a quick dinner recipe,
                    healthy meal ideas, vegan recipes, or international cuisine,
                    our AI can generate the perfect recipe instantly.
                </p>

            </section>

        </div>
    )
}
