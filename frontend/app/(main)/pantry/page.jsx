// keep it server component
// Fetch pantry items
// Render UI
// Pass data to components
import { Package, Plus, ChefHat, Loader2 } from 'lucide-react';
import AddToPantryModal from "@/components/pantry/AddToPantryModal";
import { getPantryItems } from "@/actions/pantry.actions";
import PantryGrid from "@/components/pantry/PantryGrid";
import { redirect } from "next/navigation"
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/ui/EmptyState";
import { checkUserServer } from "@/lib/checkUserServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Pantry() {
    // const [isModalOpen, setIsModalOpen] = useState(false)
    const user = await checkUserServer();

    if (!user) {
        redirect("/");
    }
    const start = Date.now();
    const label = `pantry-fetch-${Date.now()}`;

    console.time(label);

    const pantryItems = await getPantryItems();

    console.timeEnd(label);
    console.log("Pantry fetch time:", Date.now() - start, "ms");

    /* empty state */
    if (pantryItems.items.length === 0) {
        return (
            <EmptyState
                title="Your Pantry is Empty"
                description="Add ingredients to your pantry and discover recipes you can cook."
                buttonText="Add Ingredient"
                buttonHref="/pantry"
            />
        );
    }
    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-5xl">

                <div className="flex items-center justify-between mb-8">

                    <div className="flex items-center gap-3">
                        <Package className="w-16 h-16 text-orange-600" />

                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
                                My Pantry
                            </h1>

                            <p className="text-stone-600 font-light mt-3">
                                Manage your ingredients and discover what you can cook
                            </p>
                        </div>
                    </div>
                    <AddToPantryModal />

                </div>
                {/* Quick Action card - Find Recipes */}

                {pantryItems.items.length > 0 && (
                    <Link href="/pantry/recipes" className="block mb-8">
                        <div className="bg-linear-to-br from-green-600 to-emerald-500 text-white p-6 border-2 border-emerald-700 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 p-3 border-2 border-white/30 group-hover:bg-white/30 transition-colors">
                                    <ChefHat className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl mb-1">
                                        What Can I Cook Today?
                                    </h3>
                                    <p className="text-green-100 text-sm font-light">
                                        Get AI-powered recipe suggestions from your {pantryItems.items.length}{" "}
                                        ingredients
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
                )}

                <PantryGrid items={pantryItems.items} />
            </div>
        </div>
    );
}