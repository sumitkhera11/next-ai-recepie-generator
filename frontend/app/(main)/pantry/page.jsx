// keep it server component
// Fetch pantry items
// Render UI
// Pass data to components
// import { Package, Plus, ChefHat, Loader2 } from 'lucide-react';
// import AddToPantryModal from "@/components/pantry/AddToPantryModal";
// import { getPantryItems } from "@/actions/pantry.actions";
// import PantryGrid from "@/components/pantry/PantryGrid";
// import { redirect } from "next/navigation"
// import Link from 'next/link';
// import { Badge } from "@/components/ui/Badge";
// import EmptyState from "@/components/ui/EmptyState";
// import { checkUserServer } from "@/lib/checkUserServer";


// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export default async function Pantry() {


//     // ✅ FINAL CALL
//     const user = await checkUserServer();

//     if (!user) {
//         redirect("/");
//     }

//     console.log("PANTRY_PAGE_USER:", user);

//     const start = Date.now();
//     const label = `pantry-fetch-${Date.now()}`;

//     console.time(label);

//     const pantryItems = await getPantryItems();

//     console.timeEnd(label);
//     console.log("Pantry fetch time:", Date.now() - start, "ms");

//     /* empty state */
//     if (pantryItems.items.length === 0) {
//         return (
//                 <EmptyState
//                     title="Your Pantry is Empty"
//                     description="Add ingredients to your pantry and discover recipes you can cook."
//                     buttonText="Add Ingredient"
//                 />
//         );
//     }
//     return (
//         <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
//             <div className="container mx-auto max-w-5xl">

//                 <div className="flex items-center justify-between mb-8">

//                     <div className="flex items-center gap-3">
//                         <Package className="w-16 h-16 text-orange-600" />

//                         <div>
//                             <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
//                                 My Pantry
//                             </h1>

//                             <p className="text-stone-600 font-light mt-3">
//                                 Manage your ingredients and discover what you can cook
//                             </p>
//                         </div>
//                     </div>
//                     <AddToPantryModal />

//                 </div>
//                 {/* Quick Action card - Find Recipes */}

//                 {pantryItems.items.length > 0 && (
//                     <Link href="/pantry/recipes" className="block mb-8">
//                         <div className="bg-linear-to-br from-green-600 to-emerald-500 text-white p-6 border-2 border-emerald-700 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
//                             <div className="flex items-center gap-4">
//                                 <div className="bg-white/20 p-3 border-2 border-white/30 group-hover:bg-white/30 transition-colors">
//                                     <ChefHat className="w-8 h-8" />
//                                 </div>
//                                 <div className="flex-1">
//                                     <h3 className="font-bold text-xl mb-1">
//                                         What Can I Cook Today?
//                                     </h3>
//                                     <p className="text-green-100 text-sm font-light">
//                                         Get AI-powered recipe suggestions from your {pantryItems.items.length}{" "}
//                                         ingredients
//                                     </p>
//                                 </div>
//                                 <div className="hidden sm:block">
//                                     <Badge className="bg-white/20 text-white border-2 border-white/30 font-bold uppercase tracking-wide">
//                                         {pantryItems.items.length} items
//                                     </Badge>
//                                 </div>
//                             </div>
//                         </div>
//                     </Link>
//                 )}

//                 <PantryGrid items={pantryItems.items} />
//             </div>
//         </div>
//     );
// }


import { Package, Plus, ChefHat, Loader2 } from 'lucide-react';
import AddToPantryModal from "@/components/pantry/AddToPantryModal";
import { getPantryItems } from "@/actions/pantry.actions";
import PantryGrid from "@/components/pantry/PantryGrid";
import { redirect } from "next/navigation"
import Link from 'next/link';
import { Badge } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { checkUserServer } from "@/lib/checkUserServer";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Pantry() {
    // ✅ Auth Check
    const user = await checkUserServer();
   if (!user) {
    redirect("/sign-in");   
  }

    // ✅ Fetch Items
    const pantryItems = await getPantryItems();
    const hasItems = pantryItems.items && pantryItems.items.length > 0;

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-5xl">

                {/* Header Container */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    {/* Left Side: Icon and Title */}
                    <div className="flex items-center gap-3">
                        <Package className="w-12 h-12 md:w-16 md:h-16 text-orange-600" />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
                                My Pantry
                            </h1>
                            <p className="text-stone-600 font-light mt-3">
                                Manage your ingredients and discover what you can cook
                            </p>
                        </div>
                    </div>
                    {/* Right Side: Action Button */}
                    <AddToPantryModal showTrigger={hasItems} />
                </div>
                {/* --- CONDITIONAL CONTENT AREA --- */}
                {!hasItems ? (
                    /* Case 1: Empty Pantry */
                    <EmptyState
                        title="Your Pantry is Empty"
                        description="Add ingredients to your pantry and discover recipes you can cook."
                        buttonText="Add Ingredient"
                    />
                ) : (
                    /* Case 2: Pantry has items */
                    <>
                        {/* Quick Action card - Find Recipes */}
                        <Link href="/pantry/recipes" className="block mb-8">
                            <div className="bg-linear-to-br from-green-600 to-emerald-500 text-white p-6 border-2 border-emerald-700 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 border-2 border-white/30 group-hover:bg-white/30 transition-colors">
                                        <ChefHat className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl mb-1">
                                            What Can I Cook Today?
                                        </h3>
                                        <p className="text-green-100 text-sm font-light">
                                            Get AI-powered recipe suggestions from your{" "}
                                            {pantryItems.items.length} ingredients
                                        </p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <Badge className="bg-white/20 text-white border-2 border-white/30 font-bold uppercase tracking-wide">
                                            {pantryItems.items.length} items
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <PantryGrid items={pantryItems.items} />
                    </>
                )}
            </div>
        </div>
    );
}