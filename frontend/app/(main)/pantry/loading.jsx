import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
      <p className="text-stone-500">Loading your pantry...</p>
    </div>
  );
}