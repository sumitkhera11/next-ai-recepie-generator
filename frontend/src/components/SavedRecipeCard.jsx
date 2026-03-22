// "use client";

// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { removeRecipeFromCollection } from "@/actions/recipe.actions";

// export default function SavedRecipeCard({ item }) {
//     const router = useRouter();
//     const [localItems, setLocalItems] = useState(initialItems);
//     const recipe = item.recipe;

//     const handleRemove = async (item.id) => {
//         console.log("REMOVE CLICKED:", recipe.id);
//         try {

//             const res = await removeRecipeFromCollection(recipe.id);

//             console.log("REMOVE_RESULT:", res);
//              if (res.success) {
//                 //  alert("Deleted ✅");
//                 // router.refresh(); // ✅ refresh server data
//                 setLocalItems(prev => prev.filter(i => i.id !== item.id));
//             }

//         } catch (error) {
//             console.error("REMOVE ERROR:", error);
//         }
//     };

//     return (
//         <div className="group border rounded-xl overflow-hidden hover:shadow-xl transition duration-300">

//             {/* Image */}
//             <div className="relative h-48 w-full overflow-hidden">
//                 <Image
//                     src={recipe?.imageurl || "/placeholder.jpg"}
//                     alt={recipe.title}
//                     fill
//                     className="object-cover group-hover:scale-110 transition duration-500"
//                 />
//             </div>

//             {/* Content */}
//             <div className="p-4">
//                 <h2 className="text-lg font-semibold line-clamp-1">
//                     {recipe.title}
//                 </h2>

//                 <p className="text-sm text-gray-500 mb-2">
//                     {recipe.cuisine || "Recipe"}
//                 </p>

//                 <div className="flex justify-between items-center">
//                     <a
//                         href={`/recipes/${recipe.slug}`}
//                         className="text-blue-600 text-sm hover:underline"
//                     >
//                         View →
//                     </a>

//                     <button
//                         onClick={handleRemove}
//                         className="text-red-500 text-sm hover:underline"
//                     >
//                         Remove
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
"use client";

import { useRouter } from "next/navigation";

export default function SavedRecipeCard({ item, jwt }) {
    const router = useRouter();
    console.log("ITEM ID:", item.id);
    console.log("RECIPE ID:", item.recipe.id);
    const recipe = item.recipe;

    const handleRemove = async () => {
    console.log("DELETE ID:", item.id);

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/saved-recipes/${item.id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );

        console.log("DELETE RESPONSE:", res);

        if (res.ok) {
            router.refresh(); // 🔥 MUST
        }

    } catch (error) {
        console.error("DELETE ERROR:", error);
    }
};

    return (
        <div className="group border rounded-xl overflow-hidden">

            {/* Image */}
            <div className="relative h-48 w-full">
                <img
                    src={recipe?.imageurl || "/placeholder.jpg"}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="p-4">
                <h2>{recipe.title}</h2>

                <button
                    onClick={handleRemove}
                    className="text-red-500 text-sm"
                >
                    Remove
                </button>
            </div>
        </div>
    );
}