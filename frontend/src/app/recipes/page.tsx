"use client";

import { useEffect, useState } from "react";

interface Recipe {
  id: number;
  title: string;
  description: string;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      const res = await fetch("http://localhost:3001/recipes");
      const data = await res.json();
      setRecipes(data);
    }
    fetchRecipes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Receitas 🍲</h1>
      <ul className="space-y-2">
        {recipes.map((recipe) => (
          <li
            key={recipe.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{recipe.title}</h2>
            <p className="text-gray-600">{recipe.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
