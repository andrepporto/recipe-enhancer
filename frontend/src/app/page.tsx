"use client";

import { useRouter } from "next/router";

interface Recipe {
  id: number;
  title: string;
  description: string;
}

export default function RecipesPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Receitas 🍲</h1>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      onClick={() => router.push("/recipes")}>
        Testar router
      </button>
    </div>
  );
}
