"use client";

import { apiFetch } from "@/api/globalFetch";
import { useApiSWR } from "@/api/useApiSWR";
import { useSession } from "@/api/useSession";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { mutate } from "swr";

export default function RecipesPage() {
  const { user } = useSession();
  const { data: recipes = [], error, isLoading } = useApiSWR('/recipes');
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  async function onDelete(id: string) {
    if (!confirm('Tem certeza?')) return;
    
    setDeleting(id);
    try {
      await apiFetch('/recipes/:id', { method: "DELETE" }, { id });
      mutate('/recipes');
    } catch (e) {
      console.error('Erro ao deletar:', e);
      alert('Erro ao deletar receita');
    } finally {
      setDeleting(null);
    }
  }

  if (isLoading) return <div className="p-6">Carregando receitas...</div>;
  if (error) return <div className="p-6 text-red-600">Erro ao carregar receitas</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Receitas 🍲</h1>
        <button 
          onClick={() => router.push('/recipes/new')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Nova Receita
        </button>
      </div>

      {recipes.length === 0 ? (
        <p className="text-gray-500">Nenhuma receita ainda. Crie uma!</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition cursor-pointer"
              onClick={() => router.push(`/recipes/${recipe.id}`)}
            >
              <h2 className="text-lg font-semibold mb-2 hover:text-blue-600">
                {recipe.title}
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                <strong>Ingredientes:</strong> {
                  Array.isArray(recipe.ingredients)
                    ? recipe.ingredients.slice(0, 3) + 
                      (recipe.ingredients.length > 3 ? '...' : '')
                    : recipe.ingredients
                }
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/recipes/${recipe.id}`);
                  }}
                  className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Ver
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(recipe.id);
                  }}
                  disabled={deleting === recipe.id}
                  className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting === recipe.id ? 'Deletando...' : 'Deletar'}
                </button>
              </div>
            </li>          
          ))}
        </ul>
      )}
    </div>
  );
}
