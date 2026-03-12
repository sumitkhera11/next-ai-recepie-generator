import NotFoundState from "@/components/ui/NotFoundState";

export default function NotFound() {
  return (
    <NotFoundState
      title="Pantry Item Not Found"
      description="The pantry item you're looking for doesn't exist."
      backHref="/pantry"
    />
  );
}