"use client";
import { useParams } from "next/navigation";
import Loader from "@/components/ui/Loader";

export default function Loading() {
    const params = useParams();
    
  const formattedSlug = params?.slug
    ?.split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Loader slug={formattedSlug} />
  );
}