import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <section className="pt-32 pb-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-6">
          AI Recipe Generator
        </h1>

        <p className="text-lg text-stone-600 mb-8">
          Generate delicious recipes instantly using AI — completely free.
        </p>

        <Button variant="primary" size="lg">
          Start Cooking 🚀
        </Button>
      </section>
    </div>
  );
}
