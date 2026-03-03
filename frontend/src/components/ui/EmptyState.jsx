import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  description = "We couldn't find what you're looking for.",
  backLink = "/",
  backText = "Go Back",
}) {
  return (
    <div className="text-center py-20">
      <h3 className="text-2xl font-bold text-stone-900 mb-2">
        {title}
      </h3>

      <p className="text-stone-500 mb-6">
        {description}
      </p>

      <Link
        href={backLink}
        className="inline-flex items-center gap-2 hover:text-orange-700 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        {backText}
      </Link>
    </div>
  );
}