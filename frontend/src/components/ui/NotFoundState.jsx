"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";

export default function NotFoundState({
  title = "Not Found",
  description = "The requested resource could not be found.",
  backHref = "/"
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center max-w-lg">

        <AlertCircle className="mx-auto w-14 h-14 text-orange-500 mb-6" />

        <h1 className="text-3xl font-bold mb-4">
          {title}
        </h1>

        <p className="text-stone-500 mb-8">
          {description}
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 border border-stone-300 hover:bg-stone-100 px-5 py-3 rounded-lg transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry
          </button>
        </div>

      </div>
    </div>
  );
}