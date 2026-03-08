// ===============================
// Homepage Stats
// ===============================

export const SITE_STATS = [
  {
    label: "Recipes Generated",
    value: "25K+",
  },
  {
    label: "Active Users",
    value: "8K+",
  },
  {
    label: "Cuisines Covered",
    value: "120+",
  },
  {
    label: "AI Generations",
    value: "50K+",
  },
];


// ===============================
// Features Section
// ===============================

export const FEATURES = [
  {
    icon: "Sparkles",
    title: "AI Recipe Generation",
    description:
      "Generate complete recipes instantly using AI. Just type ingredients or a dish name and get cooking instructions.",
  },
  {
    icon: "Clock",
    title: "Save Time Cooking",
    description:
      "Discover quick and delicious meals without spending hours searching for recipes online.",
  },
  {
    icon: "Flame",
    title: "Trending Recipes",
    description:
      "Explore the most popular recipes people are cooking right now from cuisines around the world.",
  },
  {
    icon: "Star",
    title: "Save Your Favorites",
    description:
      "Bookmark and organize your favorite recipes so you can cook them anytime.",
  },
];


// ===============================
// How It Works Section
// ===============================

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Enter Dish or Ingredients",
    description:
      "Type any recipe name or ingredients you have available in your kitchen.",
  },
  {
    step: "02",
    title: "AI Generates Recipe",
    description:
      "Our AI creates a complete recipe including ingredients, steps, cooking time and tips.",
  },
  {
    step: "03",
    title: "Cook & Enjoy",
    description:
      "Follow the instructions and cook delicious meals instantly at home.",
  },
];


// ===============================
// Helper function for category emoji
// ===============================

export function getCategoryEmoji(category) {
  const emojiMap = {
    Beef: "🥩",
    Chicken: "🍗",
    Dessert: "🍰",
    Lamb: "🍖",
    Miscellaneous: "🍴",
    Pasta: "🍝",
    Pork: "🥓",
    Seafood: "🦐",
    Side: "🥗",
    Starter: "🥟",
    Vegan: "🥬",
    Vegetarian: "🥕",
    Breakfast: "🍳",
    Goat: "🐐",
  };

  return emojiMap[category] || "🍽️";
}


// ===============================
// Helper function for country flags
// ===============================

export function getCountryFlag(country) {
  const emojiMap = {
    American: "🗽",
    British: "👑",
    Canadian: "🍁",
    Chinese: "🐉",
    Croatian: "⚽",
    Dutch: "🌷",
    Egyptian: "🐫",
    Filipino: "🌴",
    French: "🥐",
    Greek: "🏛️",
    Indian: "🪷",
    Irish: "☘️",
    Italian: "🍕",
    Jamaican: "🌴",
    Japanese: "🗾",
    Kenyan: "🦒",
    Malaysian: "🌺",
    Mexican: "🌮",
    Moroccan: "🕌",
    Polish: "🦅",
    Portuguese: "🚢",
    Russian: "❄️",
    Spanish: "💃",
    Thai: "🛕",
    Tunisian: "🏜️",
    Turkish: "🧿",
    Ukrainian: "🌻",
    Vietnamese: "🍜",
    Algerian: "🏜️",
    Argentinian: "⚽",
    Australian: "🦘",
    Norwegian: "❄️",
    SaudiArabian: "🕋",
    Slovakian: "🏔️",
    Syrian: "🏛️",
    Uruguayan: "⚽",
    Venezuelan: "🌞",
  };

  return emojiMap[country] ?? "🌍";
}