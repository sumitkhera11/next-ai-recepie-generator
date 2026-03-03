"use server"

// api fetch data
const MEALDB_BASE = "http://www.themealdb.com/api/json/v1/1"
// const MEALDB_BASE = "http://www.themealdb.com/api/json/v1/1/random.php"
// https://www.themealdb.com/api/json/v1/1/categories.php

// daily random recipe
export async function getRecipeOfTheDay() {
    try {
        const response = await fetch(`${MEALDB_BASE}/random.php`, {
             cache: "no-store", // cache for 24 hours
        });
        if (!response.ok) {
            throw new Error("Failed to fetch the recipe of the day");
        }
        // console.log("Status:", response.status);
        const text = await response.text();
        // console.log("Raw response:", text);

        const data1 = JSON.parse(text);

        // console.log("Parsed data:", data1);
        // const data = response.json()
        // if (!data || !data.meals) {
        //     return { recipe: null };
        // }

        if (!data1?.meals?.length) {
            // console.log("LENGTH: ", data1?.meals?.length)
            return { recipe: null };
        }
        return {
            status: 200,
            recipe: data1.meals[0],
        };

    } catch (error) {
        console.error("Error fetching recipe of the day:", error);
        throw new Error(error.message || "Failed to load recipe")
    }
}

export async function getCategories() {
    try {
        const response = await fetch(`${MEALDB_BASE}/list.php?c=list`, {
            cache: "no-store", // Cache for 1 week (categories raraly change)
        });
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        const data = await response.json()
        console.log("DATA_CATEGORIES: ", data)
        const firstCategories = data.meals
        console.log("FIRST_CATEGORIES: ", firstCategories)
        
        return {
            success: true,
            categories: data.meals || [],
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error(error.message || "Failed to load categories")
    }
}
export async function getAreas() {
    try {
        const response = await fetch(`${MEALDB_BASE}/list.php?a=list`, {
            cache: "no-store", // Cache for 1 week 
        });
        if (!response.ok) {
            throw new Error("Failed to fetch areas");
        }
        const data = await response.json()
        return {
            success: true,
            areas: data.meals || [],
        }
    } catch (error) {
        console.error("Error fetching areas:", error);
        throw new Error(error.message || "Failed to load areas")
    }
}
export async function getMealsByCategory(category) {
    
    try {
        const response = await fetch(`${MEALDB_BASE}/filter.php?c=${category}`, {
            cache: "no-store", // Cache for 24 hours
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch meals");
        }
        const data = await response.json()

        return {
            success: true,
            meals: data.meals || [],
            category
        }
    } catch (error) {
        console.error("Error fetching meals by category:", error);
        throw new Error(error.message || "Failed to load meals by category")
        
    }
}
export async function getMealsByCuisine (cuisine) {
    
    try {
        const response = await fetch(`${MEALDB_BASE}/filter.php?a=${cuisine}`, {
            cache: "no-store", // Cache for 24 hours
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch cuisine");
        }
        const data = await response.json()

        return {
            success: true,
            meals: data.meals || [],
            cuisine
        }
    } catch (error) {
        console.error("Error fetching meals by cuisine:", error);
        throw new Error(error.message || "Failed to load meals by cuisine")
        
    }
}

export async function getMealsByArea(area) {
    try {
        const response = await fetch(`${MEALDB_BASE}/filter.php?a=${area}`, {
           cache: "no-store", // Cache for 24 hours
        });
        if (!response.ok) {
            throw new Error("Failed to fetch meals by area");
        }
        const data = response.json()
        return {
            success: true,
            meals: data.meals || [],
            area
        }
    } catch (error) {
        console.error("Error fetching meals by area:", error);
        throw new Error(error.message || "Failed to load meals by area")
    }
}

export async function getMealById(id) {
  try {
    const response = await fetch(
      `${MEALDB_BASE}/lookup.php?i=${id}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recipe by id");
    }

    const data = await response.json();

    return {
      success: true,
      meal: data.meals?.[0] || null,
    };
  } catch (error) {
    console.error("Error fetching meal by id:", error);
    throw new Error("Failed to load recipe details");
  }
}
