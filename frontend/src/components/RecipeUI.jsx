"use client";

import Image from "next/image";
import { useState } from "react";
import {
    ArrowLeft,
    Clock,
    Users,
    ChefHat,
    Flame,
    Bookmark,
    BookmarkCheck,
    Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import PdfButton from "@/components/PdfButton";
import useFetch from "@/hooks/use-fetch";

import {
    saveRecipeToCollection,
    removeRecipeFromCollection
} from "@/actions/recipe.actions";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RecipeUI({ recipe, fallback = "/dashboard" }) {

    const router = useRouter();

    const [checkedIngredients, setCheckedIngredients] = useState([]);
    const [isSaved, setIsSaved] = useState(recipe?.isSaved || false);

    const getStepIcon = (text) => {
        const t = text.toLowerCase();

        if (t.includes("chop") || t.includes("slice") || t.includes("cut")) return "🥬";
        if (t.includes("add") || t.includes("season") || t.includes("salt")) return "🧂";
        if (t.includes("cook") || t.includes("heat") || t.includes("fry") || t.includes("boil")) return "🔥";
        if (t.includes("serve") || t.includes("garnish")) return "🍚";

        return "👨‍🍳";
    };


    /* -------------------------------- */
    /* BACK BUTTON */
    /* -------------------------------- */

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push(fallback);
        }
    };

    /* -------------------------------- */
    /* SAVE / REMOVE COLLECTION */
    /* -------------------------------- */

    const {
        loading: saving,
        fn: saveToCollection
    } = useFetch(saveRecipeToCollection);

    const {
        loading: removing,
        fn: removeFromCollection
    } = useFetch(removeRecipeFromCollection);

    const handleToggleSave = async () => {

        if (!recipe?.id) return;

        if (isSaved) {

            const result = await removeFromCollection(recipe.id);

            if (result?.success) {
                setIsSaved(false);
                toast.success("Recipe removed from collection");
            }

        } else {

            const result = await saveToCollection(recipe.id);

            if (!result) return;

            if (result.alreadySaved) {
                toast.info("Recipe already saved");
                setIsSaved(true);
                return;
            }

            if (result.success) {
                setIsSaved(true);
                toast.success("Recipe saved to collection!");
            }
        }
    };

    /* -------------------------------- */
    /* DESCRIPTION NORMALIZER */
    /* -------------------------------- */

    function extractTextFromBlocks(blocks) {

        if (!blocks) return "";

        if (typeof blocks === "string") return blocks;

        if (!Array.isArray(blocks)) return "";

        return blocks
            .map(block =>
                block?.children?.map(child => child?.text || "").join("") || ""
            )
            .join("\n");
    }

    /* -------------------------------- */
    /* INGREDIENTS NORMALIZER */
    /* -------------------------------- */

    const normalizedIngredients =
        Array.isArray(recipe?.ingredients)
            ? recipe.ingredients.map((ing) => {

                if (typeof ing === "string") return ing;

                return `${ing?.quantity || ""} ${ing?.unit || ""} ${ing?.item || ""}${ing?.notes ? ` (${ing.notes})` : ""
                    }`.trim();

            })
            : [];

    /* -------------------------------- */
    /* INGREDIENT CHECKBOX */
    /* -------------------------------- */

    const toggleIngredient = (index) => {

        setCheckedIngredients((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );

    };

    /* -------------------------------- */
    /* INSTRUCTIONS NORMALIZER */
    /* -------------------------------- */

    const normalizedInstructions =
        Array.isArray(recipe?.instructions)
            ? recipe.instructions.map((stepObj, index) => {

                if (typeof stepObj === "string") {
                    return {
                        step: index + 1,
                        text: stepObj
                    };
                }

                return {
                    step: stepObj?.step || index + 1,
                    text: stepObj?.description || stepObj?.instruction || ""
                };

            })
            : [];

    /* -------------------------------- */
    /* SAFETY */
    /* -------------------------------- */

    if (!recipe) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <h1 className="text-3xl font-bold">Recipe Not Found</h1>
            </div>
        );
    }

    /* -------------------------------- */
    /* COMPONENT UI */
    /* -------------------------------- */
    return (
        <>
            {/* ---------- SEO JSON ---------- */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Recipe",

                        name: recipe.title,

                        image:
                            recipe.imageurl ||
                            `https://source.unsplash.com/featured/?${recipe.title.replace(/ /g, "+")},food`,

                        description: extractTextFromBlocks(recipe.description),

                        author: {
                            "@type": "Organization",
                            name: "Recipion"
                        },

                        publisher: {
                            "@type": "Organization",
                            name: "Recipion"
                        },

                        mainEntityOfPage: {
                            "@type": "WebPage",
                            "@id": `https://recipion.com/recipes/${recipe.slug}`
                        },

                        keywords: [
                            "AI recipe generator",
                            "Recipion recipe",
                            recipe.title,
                            "cook with ingredients"
                        ],

                        recipeIngredient: normalizedIngredients,

                        recipeInstructions: normalizedInstructions.map((s) => ({
                            "@type": "HowToStep",
                            text: s.text
                        })),

                        prepTime: recipe.preptime
                            ? `PT${recipe.preptime}M`
                            : undefined,

                        cookTime: recipe.cooktime
                            ? `PT${recipe.cooktime}M`
                            : undefined,

                        totalTime:
                            recipe.preptime && recipe.cooktime
                                ? `PT${recipe.preptime + recipe.cooktime}M`
                                : undefined,

                        recipeYield: recipe.servings
                            ? `${recipe.servings} servings`
                            : undefined,

                        recipeCategory: recipe.category || "AI Generated Recipe",
                        recipeCuisine: recipe.cuisine || "International"
                    })
                }}
            />

            <article className="max-w-5xl mx-auto px-4 py-10">

                {/* BACK BUTTON */}

                <div className="mb-6 flex items-center justify-between">

                    <button
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>

                </div>

                {/* HERO IMAGE */}

                <header className="mb-10">

                    {recipe.imageurl && (
                        <div className="relative w-full h-[350px] mb-6 rounded-xl overflow-hidden">

                            <Image
                                src={recipe.imageurl || `https://source.unsplash.com/featured/?${recipe.title.replace(/ /g, "+")},food`}
                                alt={recipe.title}
                                fill
                                className="object-cover"
                                priority
                            />

                        </div>
                    )}

                    <div className="mb-6">
                        <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 text-sm rounded-full mb-3">
                            AI Generated Recipe
                        </span>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                            {recipe.title}
                        </h1>
                    </div>


                    {recipe.description && (
                        <p className="mt-6 text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                            {extractTextFromBlocks(recipe.description)}
                        </p>
                    )}

                    {/* META */}

                    <div className="flex flex-wrap gap-6 text-stone-600 mt-6">

                        {(recipe.preptime || recipe.cooktime) && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-600" />
                                <span className="font-medium">
                                    {(parseInt(recipe.preptime) || 0) +
                                        (parseInt(recipe.cooktime) || 0)} mins total
                                </span>
                            </div>
                        )}

                        {recipe.servings && (
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-orange-600" />
                                <span className="font-medium">
                                    {recipe.servings} servings
                                </span>
                            </div>
                        )}

                        {recipe.cuisine && (
                            <div className="flex items-center gap-2">
                                🍽 {recipe.cuisine}
                            </div>
                        )}

                        {recipe.category && (
                            <div className="flex items-center gap-2">
                                📂 {recipe.category}
                            </div>
                        )}

                        {recipe?.nutrition?.calories && (
                            <div className="flex items-center gap-2">
                                <Flame className="w-5 h-5 text-orange-600" />
                                {recipe.nutrition.calories} cal/serving
                            </div>
                        )}

                    </div>

                </header>

                {/* ACTION BUTTONS */}

                <div className="flex gap-3 mb-8">

                    <Button
                        onClick={handleToggleSave}
                        disabled={saving || removing}
                        className={`${isSaved
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-orange-600 hover:bg-orange-700"
                            } text-white gap-2`}
                    >

                        {saving || removing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {saving ? "Saving..." : "Removing..."}
                            </>
                        ) : isSaved ? (
                            <>
                                <BookmarkCheck className="w-4 h-4" />
                                Saved
                            </>
                        ) : (
                            <>
                                <Bookmark className="w-4 h-4" />
                                Save to Collection
                            </>
                        )}

                    </Button>

                    <PdfButton recipe={recipe} />

                </div>

                {/* MAIN GRID */}

                <div className="grid md:grid-cols-3 gap-10">

                    {/* INGREDIENTS */}

                    <section className="md:col-span-1 bg-gray-50 p-6 rounded-xl shadow-sm border-2 border-gray-100">

                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <ChefHat className="w-6 h-6 text-orange-600" />
                            Ingredients
                        </h2>

                        <ul className="space-y-3">

                            {normalizedIngredients.map((ingredient, index) => (

                                <li key={index} className="flex items-center gap-2">

                                    <input
                                        type="checkbox"
                                        checked={checkedIngredients.includes(index)}
                                        onChange={() => toggleIngredient(index)}
                                    />

                                    <span
                                        className={
                                            checkedIngredients.includes(index)
                                                ? "line-through text-gray-400"
                                                : ""
                                        }
                                    >
                                        {ingredient}
                                    </span>

                                </li>

                            ))}

                        </ul>

                    </section>

                    {/* INSTRUCTIONS */}

                    <section className="md:col-span-2 bg-white p-8 rounded-2xl shadow-md border border-gray-100">

                        {/* Section Title */}

                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-lg">
                                🍳
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900">
                                Cooking Instructions
                            </h2>
                        </div>


                        {normalizedInstructions.length > 0 ? (

                            <ol className="space-y-8">

                                {normalizedInstructions.map((step, index) => (

                                    <li
                                        key={index}
                                        className="relative bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition"
                                    >

                                        {/* Step Number Badge */}

                                        <div className="absolute -left-4 top-6 w-8 h-8 flex items-center justify-center bg-orange-600 text-white text-sm font-bold rounded-full shadow">
                                            {step.step}
                                        </div>

                                        {/* Step Header */}

                                        <div className="flex items-center gap-3 mb-2">

                                            <span className="text-xl">
                                                {getStepIcon(step.text)}
                                            </span>

                                            <h3 className="text-lg font-semibold text-orange-600">
                                                Step {step.step}
                                            </h3>

                                        </div>

                                        {/* Step Text */}

                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {step.text}
                                        </p>
                                    </li>


                                ))}

                            </ol>

                        ) : (

                            <p className="text-gray-500">
                                No instructions available.
                            </p>

                        )}

                    </section>
                    {/* ---------------------------- */}
                    {/* COOKING TIPS (SEO BLOCK) */}
                    {/* ---------------------------- */}

                    <section className="mt-12  border border-orange-200 p-6 rounded-xl bg-blue-50">

                        <div className="flex items-center gap-2 mb-3">
                            <ChefHat className="w-5 h-5 text-orange-600" />
                            <h3 className="text-2xl font-bold">
                                Cooking Tips
                            </h3>
                        </div>

                        <p className="text-gray-700 leading-relaxed">
                            For the best flavor, use fresh ingredients and cook on medium heat.
                            This recipe pairs well with basmati rice, fresh salad, or yogurt.
                            Adjust spices according to your taste preference.
                        </p>

                    </section>


                    {/* ---------------------------- */}
                    {/* BACKEND CHEF TIPS */}
                    {/* ---------------------------- */}

                    {recipe?.tips?.length > 0 && (

                        <section className="mt-10">

                            <div className="flex items-center gap-2 mb-6">
                                <ChefHat className="w-6 h-6 text-orange-600" />
                                <h2 className="text-2xl font-bold">
                                    Chef Tips
                                </h2>
                            </div>

                            <div className="grid gap-4">

                                {recipe.tips.map((tip, index) => (

                                    <div
                                        key={index}
                                        className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex gap-3"
                                    >

                                        <span className="text-xl">💡</span>

                                        <p className="text-gray-700 leading-relaxed">
                                            {tip}
                                        </p>

                                    </div>

                                ))}

                            </div>

                        </section>

                    )}


                    {/* ---------------------------- */}
                    {/* INGREDIENT SUBSTITUTIONS */}
                    {/* ---------------------------- */}

                    {recipe?.substitutions?.length > 0 && (

                        <section className="mt-12">

                            <div className="flex items-center gap-2 mb-6">
                                <ChefHat className="w-6 h-6 text-orange-600" />
                                <h2 className="text-2xl font-bold">
                                    Ingredient Substitutions
                                </h2>
                            </div>

                            <div className="grid gap-4">

                                {recipe.substitutions.map((item, index) => (

                                    <div
                                        key={index}
                                        className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-3"
                                    >

                                        <span className="text-xl">🔄</span>

                                        <p className="text-gray-700 leading-relaxed">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                    )}
                </div>
                {/* 🔥 Nutrition Section FULL WIDTH */}
                {recipe?.nutrition && (
                    <section className="mt-16">

                        <h2 className="text-2xl font-bold  mb-6">
                            Nutrition
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center shadow-sm">
                                <p className="text-sm text-gray-500">Calories</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {recipe.nutrition.calories || "-"}
                                </p>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center shadow-sm">
                                <p className="text-sm text-gray-500">Carbs</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {recipe.nutrition.carbs || "-"}
                                </p>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center shadow-sm">
                                <p className="text-sm text-gray-500">Protein</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {recipe.nutrition.protein || "-"}
                                </p>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center shadow-sm">
                                <p className="text-sm text-gray-500">Fat</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {recipe.nutrition.fat || "-"}
                                </p>
                            </div>

                        </div>

                    </section>
                )}

            </article>
        </>
    );
}
