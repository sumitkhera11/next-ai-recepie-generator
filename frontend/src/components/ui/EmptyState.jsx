"use client";

import { Package, Plus } from "lucide-react";
import { usePantryModal } from "@/context/PantryModalContext";

export default function EmptyState({
  title = "Nothing here yet",
  description = "Start by adding your first item.",
  buttonText = "Add Item"
}) {
  const {  setOpen } = usePantryModal();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-md">

        {/* Icon */}
        <Package className="mx-auto w-14 h-14 text-orange-500 mb-6" />

        {/* Title */}
        <h2 className="text-2xl font-semibold text-stone-900 mb-3">
          {title}
        </h2>

        {/* Description */}
        <p className="text-stone-500 mb-8">
          {description}
        </p>

        {/* CTA Button */}
        <button
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-lg transition"
          onClick={() => {
            console.log("EmptyState button clicked");
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          {buttonText}
        </button>

      </div>
    </div>
  );
}