"use client"
import useFetch from '@/hooks/use-fetch'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import EmptyState from "@/components/ui/EmptyState";
import RecipeCard from "@/components/RecipeCard"

// const RecipeGrid = ({
//     // type, // category or // cuisine
//     // value, // actual category/cuisine name
//     // fetchAction, // server actions to fetch meals
//     meals = [],
//     backLink = "/dashboard"

// }) => {
//     // console.log("TYPE: " , type);
//     // console.log("VALUE: ", value);
//     // console.log("FETCH_ACTION: ", fetchAction);
//     // console.log("BACK_LINK: " , backLink);

//     // const {data, loading, fn:fetchMeals} = useFetch(fetchAction);
//     // useEffect(() => {
//     //     if(value) {
//     //         const formattedValue  = value.charAt(0).toUpperCase() + value.slice(1);
//     //         console.log("FORMATTED_VALUE:",formattedValue)
//     //         fetchMeals(formattedValue);
//     //     }
//     // }, [value]) // when value changes we are gonna fetch it again
//     // console.log("RAW_DATA:", data);
//     // console.log("fetch+meals:", fetchMeals);


//     // const meals = data?.meals || [];
//     const displayName = value?.replace(/-/g, " "); // convert saudi-arabian to saudi arabian
//     // const displayName = "Starter"; // convert saudi-arabian to saudi arabian
//     console.log("MEALS : ", meals);
//     console.log("DISPLAYNAME : ", displayName);

//     return (
//         <div className='min-h-screen bg-stone-50 pt-14 pb-16 px-4'>
//             <div className='container mx-auto max-w-7xl'>
//                 <div className='mb-8'>
//                     <Link
//                         href={backLink}
//                         className='inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors mb-4'>
//                         <ArrowLeft className='w-4 h-4' />
//                         Back to Dashboard
//                     </Link>
//                     <h1 className='text-5xl md:text-6xl font-bold text-stone-900 capitalize tracking-tight leading-tight'>
//                         {displayName}{" "}
//                         <span className='text-orange-600'>
//                             {type === "cuisine" ? "Cuisine" : "Recipes"}
//                         </span>
//                     </h1>
//                     {meals.length > 0 && (
//                         <p className="text-stone-600 mt-2">
//                             {meals.length} delicious {displayName} {" "}
//                             {type === "cuisine" ? "dishes" : "recipes"} to try
//                         </p>
//                     )}
//                 </div>
//                 {meals.length > 0 && (
//                     <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
//                         {meals.map((meal, i) => (
//                             <div key={i}>{meal.idMeal}</div>
//                         ))}

//                     </div>
//                 )}
//                 {meals.length === 0 && (
//                     <EmptyState
//                         title="No recipes found"
//                         description={`We couldn't find any ${displayName} ${type === "cuisine" ? "dishes" : "recipes"
//                             }.`}
//                         backLink={backLink}
//                         backText="Go back to explore more"
//                     />
//                 )}
//             </div>
//         </div>
//     )
// }

// export default RecipeGrid

function RecipeGrid({ type, meals, backLink }) {
    const typeConfig = {
        category: {
            emptyTitle: "No recipes found",
            emptyDescription: "Try exploring other categories.",
        },
        cuisine: {
            emptyTitle: "No cuisine dishes found",
            emptyDescription: "Try exploring other cuisines.",
        },
    };
    const config = typeConfig[type] || typeConfig.category;

    return (
        <>
            <div className="mb-6">
                <Link
                    href={backLink}
                    className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors"

                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>

            {meals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {meals.map((meal, index) => (
                        <RecipeCard
                            key={meal.idMeal}
                            recipe={meal}
                            variant="grid"
                            priority={index === 0}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title={config.emptyTitle}
                    description={config.emptyDescription}
                    backLink={backLink}
                    backText="Go back to explore more"
                />
            )}
        </>
    );
}

export default RecipeGrid;