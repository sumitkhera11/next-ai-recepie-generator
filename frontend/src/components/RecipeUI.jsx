"use client";

import Image from "next/image";
import { useState,useEffect  } from "react";
import Link from 'next/link'
import {
    ArrowLeft,
    Clock,
    Users,
    ChefHat,
    Flame,
    Lightbulb,
    Bookmark,
    BookmarkCheck,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import useFetch from "@/hooks/use-fetch";

import {
    saveRecipeToCollection,
    removeRecipeFromCollection,
} from "@/actions/recipe.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RecipeUI({ recipe,fallback = "/dashboard"  }) {
    const [checkedIngredients, setCheckedIngredients] = useState([]);
    const [isSaved, setIsSaved] = useState(recipe?.isSaved || false);
    const router = useRouter()

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push(fallback);
        }
    };
    // 🔥 useFetch hooks
    const {
        loading: saving,
        data: saveData,
        fn: saveToCollection,
    } = useFetch(saveRecipeToCollection);

    const {
        loading: removing,
        data: removeData,
        fn: removeFromCollection,
    } = useFetch(removeRecipeFromCollection);

    //handle save effect
    useEffect(() => {
        if (saveData?.success) {
            if (saveData.alreadySaved) {
                toast.info("Recipe is already in your collection")
            } else {
                setIsSaved(true)
                toast.info("Recipe saved to your collection!")
            }
        }
    }, [saveData])

    // handle remove data
    useEffect(() => {
        if (removeData?.success) {
            setIsSaved(false)
            toast.info("Recipe removed from collection!");
        }
    }, [removeData])

    // Toggle Save
    const handleToggleSave = async () => {
        if (!recipe?.id) return;

        let result;

        if (isSaved) {
            result = await removeFromCollection(recipe.id);

            if (result?.success) {
                setIsSaved(false);
                toast.success("Recipe removed from collection");
            }
        } else {
            result = await saveToCollection(recipe.id);

            if (result?.success) {
                setIsSaved(true);

                toast.success(
                    result.alreadySaved
                        ? "Recipe already saved"
                        : "Recipe saved to collection!"
                );
            }
        }
    };
    // 🔥 SAFE DESCRIPTION EXTRACTOR (no crash if string comes)
    //   Strapi Rich Text store karta hai data structured form me.
    // Frontend ko plain string chahiye hoti hai.
    // Isliye ye converter function zaroori hai.
    function extractTextFromBlocks(blocks) {
        if (!blocks) return "";
        if (typeof blocks === "string") return blocks;

        if (!Array.isArray(blocks)) return "";

        // ? ka matlab Agar children exist nahi karta
        // toh crash nahi karega.
        return blocks
            .map((block) =>
                block.children?.map((child) => child.text).join("") || ""
            )
            .join("\n");
    }

    const toggleIngredient = (index) => {
        setCheckedIngredients((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    if (!recipe) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <h1 className="text-3xl font-bold">Recipe Not Found</h1>
            </div>
        );
    }

    // 🔥 UPDATED – normalize ingredients for schema + UI
    const normalizedIngredients =
        recipe.ingredients?.map((ing) =>
            typeof ing === "string"
                ? ing
                : `${ing.quantity || ""} ${ing.item || ""}${ing.notes ? ` (${ing.notes})` : ""
                }`
        ) || [];

    return (
        <>
            {/* 🔥 FIXED Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Recipe",
                        name: recipe.title,
                        image: recipe.imageurl,
                        description: extractTextFromBlocks(recipe.description),
                        recipeIngredient: normalizedIngredients, // 🔥 FIXED
                        recipeInstructions: recipe.instructions?.map((stepObj) => ({
                            "@type": "HowToStep",
                            text: typeof stepObj === "string"
                                ? stepObj
                                : stepObj.instruction,
                        })),
                        prepTime: recipe.preptime ? `PT${recipe.preptime}M` : undefined,
                        cookTime: recipe.cooktime ? `PT${recipe.cooktime}M` : undefined,
                        recipeYield: recipe.servings
                            ? `${recipe.servings} servings`
                            : undefined,
                    }),
                }}
            />

            <article className="max-w-5xl mx-auto px-4 py-10">
                {/* Back */}
                <div className="mb-6">
                    <p>Recipe ID: {recipe.id}</p>
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </div>

                {/* HERO */}
                <header className="mb-10">
                    {recipe.imageurl && (
                        <div className="relative w-full h-[350px] mb-6 rounded-xl overflow-hidden">
                            <Image
                                src={recipe.imageurl}
                                alt={recipe.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        {recipe.title}
                    </h1>

                    <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                        {recipe.cuisine && <span>🍽 {recipe.cuisine}</span>}
                        {recipe.category && <span>📂 {recipe.category}</span>}
                        {recipe.preptime && <span>⏱ Prep: {recipe.preptime} min</span>}
                        {recipe.cooktime && <span>🔥 Cook: {recipe.cooktime} min</span>}
                        {recipe.servings && <span>👥 Serves: {recipe.servings}</span>}
                    </div>

                    {/* 🔥 FIXED Description */}
                    {recipe.description && (
                        <p className="mt-6 text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                            {extractTextFromBlocks(recipe.description)}
                        </p>
                    )}
                </header>
                {/* Action Buttons */}
                {/* Save Button */}
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
                                Saved to Collection
                            </>
                        ) : (
                            <>
                                <Bookmark className="w-4 h-4" />
                                Save to Collection
                            </>
                        )}
                    </Button>

                    {/* <PDFDownloadLink
                        document={<RecipePDF recipe={recipe} />}
                        fileName={`${recipe.title.replace(/\s+/g, "-").toLowerCase()}.pdf`}
                    >
                        {({ loading }) => (
                            <Button variant="outline" disabled={loading}>
                                {loading ? "Preparing PDF..." : "Download PDF"}
                            </Button>
                        )}
                    </PDFDownloadLink> */}
                </div>

                {/* MAIN GRID */}
                <div className="grid md:grid-cols-3 gap-10">
                    {/* 🔥 FIXED INGREDIENTS */}
                    <section className="md:col-span-1 bg-gray-50 p-6 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
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
                    <section className="md:col-span-2 bg-gray-50 p-6 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6">Instructions</h2>

                        {recipe.instructions?.length > 0 ? (
                            <ol className="space-y-6">
                                {recipe.instructions.map((stepObj, index) => {
                                    const description =
                                        typeof stepObj === "string"
                                            ? stepObj
                                            : stepObj.description || stepObj.instruction || "";

                                    const stepNumber =
                                        typeof stepObj === "object" && stepObj.step
                                            ? stepObj.step
                                            : index + 1;

                                    return (
                                        <li
                                            key={index}
                                            className="bg-white p-5 rounded-xl shadow-sm border"
                                        >
                                            <h3 className="font-bold mb-2">
                                                Step {stepNumber}
                                            </h3>

                                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                {description}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ol>
                        ) : (
                            <p className="text-gray-500">No instructions available.</p>
                        )}
                    </section>
                </div>

                {/* 🔥 SAFE NUTRITION */}
                {recipe.nutrition && Object.keys(recipe.nutrition).length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-2xl font-semibold mb-4">Nutrition</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(recipe.nutrition).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="bg-gray-50 p-4 rounded-lg text-center shadow-sm"
                                >
                                    <p className="text-sm text-gray-500 capitalize">{key}</p>
                                    <p className="font-bold">{value}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 🔥 FIXED TIPS */}
                {recipe.tips?.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-2xl font-semibold mb-4">Tips</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            {recipe.tips.map((tip, index) => (
                                <li key={index}>
                                    {typeof tip === "string" ? tip : JSON.stringify(tip)}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* 🔥 FIXED SUBSTITUTIONS */}
                {recipe.substitutions?.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-2xl font-semibold mb-4">Substitutions</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            {recipe.substitutions.map((sub, index) => (
                                <li key={index}>
                                    {typeof sub === "string"
                                        ? sub
                                        : `${sub.item || ""} → ${sub.substitute || sub.alternative || ""
                                        }`}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </article>
        </>
    );
}