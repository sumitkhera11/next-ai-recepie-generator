import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Clock, Flame, Star, Sparkles } from "lucide-react";

import { SITE_STATS, FEATURES, HOW_IT_WORKS_STEPS } from "@/lib/data";

/* ---------------- SEO METADATA ---------------- */

export const metadata = {
  title:
    "Recipion AI Recipe Generator – Cook With Ingredients You Already Have",
  description:
    "Generate delicious recipes using AI with the ingredients you already have in your kitchen. Recipion helps you cook smarter, reduce food waste and discover new meals instantly.",
  keywords: [
    "AI recipe generator",
    "recipes from ingredients",
    "cook with ingredients you have",
    "generate recipes with AI",
    "leftover recipe generator",
  ],
  openGraph: {
    title: "Recipion – AI Recipe Generator",
    description:
      "Turn ingredients into delicious recipes instantly using AI.",
    url: "https://recipion.com",
    siteName: "Recipion",
    images: [
      {
        url: "/pasta-dish.png",
        width: 1200,
        height: 630,
        alt: "AI Recipe Generator",
      },
    ],
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">

      {/* ---------------- HERO ---------------- */}

      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">

          <div className="flex flex-col gap-6">

            <Badge className="w-fit border-2 border-orange-600 text-orange-600 bg-orange-50 px-4 py-2 uppercase font-semibold">
              <Flame className="mr-2 w-4 h-4" />
              AI Cooking Assistant
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Generate Recipes With AI Using{" "}
              <span className="underline decoration-orange-600 italic">
                Ingredients You Already Have
              </span>
            </h1>

            <p className="text-lg md:text-xl text-stone-600 max-w-lg">
              Recipion is an AI powered recipe generator that turns the
              ingredients in your kitchen into delicious meals with
              cooking instructions, nutrition information and chef tips.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">

              <Link href="/generate">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
                  Generate Recipe
                  <Sparkles className="ml-2 w-4 h-4" />
                </Button>
              </Link>

              <Link href="/recipes">
                <Button variant="outline" size="lg">
                  Browse Recipes
                </Button>
              </Link>

            </div>

            <p className="text-sm text-stone-500">
              Join thousands of home cooks discovering recipes with AI.
            </p>

          </div>

          {/* HERO IMAGE */}

          <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-2xl overflow-hidden border-4 border-stone-900">
            <Image
              src="/pasta-dish.webp"
              alt="AI generated pasta recipe from ingredients"
              fill
              priority
              quality={80}
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 420px"
              className="object-cover"
            />

            <div className="absolute bottom-4 left-4 right-4 bg-white/90 rounded-lg p-4 shadow-lg">

              <h3 className="font-semibold text-lg">
                Creamy Garlic Pasta
              </h3>

              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-orange-500 text-orange-500" />
                ))}
              </div>

              <div className="flex gap-4 text-xs mt-2 text-stone-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  25 min
                </span>
                <span>2 servings</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}

      <section className="bg-stone-900 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

          {SITE_STATS.map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-white">{stat.val}</div>
              <p className="text-orange-500 text-sm uppercase">{stat.label}</p>
            </div>
          ))}

        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-4xl font-bold mb-12 text-center">
            Your Smart Kitchen Assistant
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {FEATURES.map((feature, index) => {

              const Icon = feature.icon;

              return (
                <Card key={index} className="border hover:border-orange-600 transition">

                  <CardContent className="p-6">

                    <Icon className="w-6 h-6 mb-4 text-orange-600" />

                    <h3 className="text-xl font-bold mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-stone-600">
                      {feature.description}
                    </p>

                  </CardContent>

                </Card>
              );

            })}

          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}

      <section className="py-20 bg-stone-900 text-white">

        <div className="max-w-5xl mx-auto">

          <h2 className="text-4xl font-bold mb-12 text-center">
            Cook in 3 Simple Steps
          </h2>

          <div className="space-y-10">

            {HOW_IT_WORKS_STEPS.map((item, i) => (

              <div key={i} className="flex gap-6">

                <div className="text-4xl font-bold text-orange-500">
                  {item.step}
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-stone-300">
                    {item.desc}
                  </p>
                </div>

              </div>

            ))}

          </div>
        </div>

      </section>

      {/* ---------------- USE CASES ---------------- */}

      <section className="py-20 px-4 bg-white">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-4xl font-bold mb-10 text-center">
            Popular Ways People Use Recipion
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div>
              <h3 className="font-semibold text-xl mb-2">
                Cook With Leftovers
              </h3>
              <p className="text-stone-600">
                Turn random ingredients in your fridge into
                delicious recipes instantly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">
                Quick Dinner Ideas
              </h3>
              <p className="text-stone-600">
                Find easy dinner recipes when you don’t know
                what to cook tonight.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">
                Healthy Meals
              </h3>
              <p className="text-stone-600">
                Generate healthy, vegan, keto and high protein recipes.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ---------------- CTA ---------------- */}

      <section className="py-20 text-center bg-orange-50">

        <h2 className="text-4xl font-bold mb-6">
          Ready to Cook Something Amazing?
        </h2>

        <p className="text-stone-600 mb-8">
          Let AI turn your ingredients into delicious meals.
        </p>

        <Link href="/generate">

          <Button
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Generate Recipe Now
          </Button>

        </Link>

      </section>

    </main>
  );
}