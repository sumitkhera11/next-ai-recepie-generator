"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react"

const STRAPI_URL = process.env.STRAPI_URL;

export default function RecipeSearch() {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (!query) return;

            async function searchRecipes() {
                const res = await fetch(
                    `${STRAPI_URL}/api/recipes?filters[title][$containsi]=${query}`
                );
                const data = await res.json();
                setResults(data?.data ?? []);
            }
            searchRecipes();
        }, 300);
        return () => clearTimeout(delayDebounce);

    }, [query]);


    return (
        <section className="mb-16">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />

                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg pl-11 pr-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                />

                {results.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden z-20">

                        {results.map((recipe) => (
                            <Link
                                key={recipe.id}
                                href={`/recipes/${recipe.slug}`}
                                className="block px-4 py-3 hover:bg-orange-50 transition border-b border-stone-100 last:border-none"
                            >
                                <div className="font-medium text-stone-800">
                                    {recipe.title}
                                </div>
                                <div className="text-sm text-stone-500 mt-1">
                                    {recipe.cuisine || "Recipe"} • View recipe →
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
