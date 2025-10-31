"use client";

import { apiFetch } from "@/api/globalFetch";
import { useApiSWR } from "@/api/useApiSWR";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

export default function RecipesPage() {
const { data: recipes = [], error, isLoading } = useApiSWR('/recipes');
  const router = useRouter();

  async function onDelete(id: string) {
    mutate(
      '/recipes',
      recipes.filter((r) => r.id !== id),
      false
    );

    try {
      await apiFetch("/recipes/:id", { method: "DELETE" }, { id });
      mutate('/recipes');
    } catch (e) {
      console.error(e);
      mutate('/recipes');
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Receitas 🍲</h1>
      <button onClick={() => router.push('/recipes/new')}>Nova Receita</button>
      <button onClick={() => router.push('/auth/login')}>LOGIN</button>
      <ul className="space-y-2">
        {recipes.map((recipe) => (
          <li
            key={recipe.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{recipe.title}</h2>
            <p className="text-gray-600">{recipe.ingredients}</p>
            <button onClick={() => onDelete(recipe.id)}>DELETE</button>
          </li>          
        ))}
      </ul>
    </div>
  );
}
