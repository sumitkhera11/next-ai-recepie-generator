import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowBigRight, Clock, Flame, Star } from "lucide-react";
import { SITE_STATS, FEATURES, HOW_IT_WORKS_STEPS } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
// import { Card } from "@/components/ui/card"
import Image from 'next/image'
import { Cookie, Refrigerator, Sparkles } from "lucide-react";


export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <section className="pt-20 pb-16 px-4" aria-labelledby="hero-heading">

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">

          {/* LEFT SIDE - TEXT */}
          <div className="flex flex-col gap-8 items-start">

            <Badge
              className="inline-flex items-center border-2 border-orange-600 !text-orange-600 bg-orange-50 font-bold px-5 py-2 text-sm md:text-base tracking-wide uppercase rounded-full"
            >
              <Flame className="mr-2 h-5 w-5 text-orange-500" />
              #1 AI Cooking Assistant
            </Badge>

            <h1
              id="hero-heading"
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
            >
              Turn your{" "}
              <span className="italic underline decoration-2 decoration-orange-600">
                leftovers
              </span>{" "}
              into <br />
              masterpieces.
            </h1>


            <p className="text-xl md:text-2xl text-stone-600 max-w-lg font-light">
              Upload ingredients or type a dish name
              AI will generate a complete recipe instantly.
              We&apos;ll tell you what to cook.
              Save money, reduce waste and eat better tonight.
            </p>
            <Link href="/generate">
              <Button
                size="lg"
                className="
      bg-orange-600 
      hover:bg-orange-700 
      text-white 
      px-8 
      py-6
      text-lg
      font-semibold
      rounded-xl
      shadow-lg
      hover:shadow-xl
      transition-all
      flex items-center
    "
              >
                Generate Recipe with AI
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/recipes">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg rounded-xl"
              >
                Browse Recipes
              </Button>
            </Link>

            <p className="mt-2 text-sm text-stone-500 ">
              <span className="font-bold text-stone-900">10k+ cooks</span>{" "}
              joined last month
            </p>
          </div>

          <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-2xl overflow-hidden border-4 border-stone-900">

            <Image
              src="/pasta-dish.png"
              alt="Delicious pasta dish made from leftovers"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
              priority
            />

            {/* White Glass Card Overlay */}
            <div className="absolute bottom-5 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-xl border border-stone-200 p-3 shadow-lg">

              {/* Top Row */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-stone-600 font-medium">
                  Chef’s Special
                </p>

                <Badge
                  variant="outline"
                  className="border-2 border-green-700 bg-green-50 text-green-700 font-bold text-xs px-2 py-0.5"
                >
                  98% MATCH
                </Badge>
              </div>

              {/* Main Heading */}
              <h3 className="text-2xl font-semibold leading-tight text-black mt-2">
                Creamy Garlic Pasta
              </h3>

              {/* Stars */}
              <div className="flex gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-orange-500 text-orange-500"
                  />
                ))}
              </div>

              {/* Meta Info */}
              <div className="flex gap-4 text-xs text-stone-500 font-medium mt-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  25 mins
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  2 servings
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>
      <section className="py-12 border-y-2 border-stone-900 bg-stone-900">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {SITE_STATS.map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-bold mb-1 text-stone-50">
                {stat.val}
              </div>
              <Badge
                variant="secondary" className="bg-transparent text-orange-500 text-sm uppercase tracking-wider font-medium border-none">
                {stat.label}
              </Badge>
            </div>
          ))}
        </div>
      </section>
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-light">
              Your Smart Kitchen
            </h2>
            <p className="text-stone-600 text-xl font-light">
              Everything you need to master your meal repo.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="border-2 border-stone-200 bg-white hover:border-orange-600 hover:shadow-lg  transition-all group py-0">
                  <CardContent className={"p-8"}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="border-2 border-stone-200 bg-orange-50 p-3 group-hover:border-orange-600 group-hover:bg-orange-100 transition colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs font-mono bg-stone-100 text-stone-600 uppercase tracking-wide border border-stone-200"
                      >
                        {feature.limit}
                      </Badge>

                    </div>
                    <h3 className="text-2xl font-bold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-stone-600 text-lg font-light">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

      </section>
      <section className="py-24 px-4 border-y-2 border-stone-200 bg-stone-900 text-stone-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-16">
            Cook in 3 Steps
          </h2>
          <div className="space-y-12">
            {HOW_IT_WORKS_STEPS.map((item, i) => {
              return (
                <div key={i}>
                  <div className="flex gap-6 items-start">
                    <Badge
                      variant="outline"
                      className="text-6xl font-bold text-orange-500 border-none bg-transparent p-0 h-auto">
                      {item.step}
                    </Badge>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">
                        {item.title}
                      </h3>
                      <p className="text-lg text-stone-400 font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  {i < HOW_IT_WORKS_STEPS.length - 1 && (
                    <hr className="my-8 bg-stone-700" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <section className="py-24 text-center bg-orange-50">

<h2 className="text-4xl font-bold mb-6">
Ready to cook something amazing?
</h2>

<p className="text-lg text-stone-600 mb-8">
Let AI turn your ingredients into delicious meals.
</p>

<Link href="/generate">
<Button
size="lg"
className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-6 text-lg rounded-xl shadow-lg"
>
Generate Your Recipe Now
</Button>
</Link>

</section>

    </div>
  );
}
