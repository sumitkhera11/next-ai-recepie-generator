// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";

// export default function EmptyState({
//   title = "No data found",
//   description = "We couldn't find what you're looking for.",
//   backLink = "/",
//   backText = "Go Back",
// }) {
//   return (
//     <div className="text-center py-20">
//       <h3 className="text-2xl font-bold text-stone-900 mb-2">
//         {title}
//       </h3>

//       <p className="text-stone-500 mb-6">
//         {description}
//       </p>

//       <Link
//         href={backLink}
//         className="inline-flex items-center gap-2 hover:text-orange-700 font-semibold"
//       >
//         <ArrowLeft className="w-4 h-4" />
//         {backText}
//       </Link>
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { Package, Plus } from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  description = "Start by adding your first item.",
  buttonText = "Add Item",
  buttonHref = "#"
}) {
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
        <Link
          href={buttonHref}
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          {buttonText}
        </Link>

      </div>
    </div>
  );
}