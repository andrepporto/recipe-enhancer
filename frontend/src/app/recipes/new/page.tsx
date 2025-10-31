"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/api/globalFetch";
import { useSession } from "@/api/useSession";

interface CreateRecipeForm {
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  userId: string;
}

export default function NewRecipePage() {
  const { register, handleSubmit, reset } = useForm<CreateRecipeForm>();
  const router = useRouter();
  const session = useSession();

  const onSubmit = async (data: CreateRecipeForm) => {
    if (!session) {
      alert("Você precisa estar logado para criar uma receita!");
      return;
    }
    await apiFetch("/recipes", {
      method: "POST",
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        ingredients: data.ingredients.split(",").map((i) => i.trim()),
        steps: data.steps.split(",").map((s) => s.trim()),
      }),
    });

    reset();
    router.push("/recipes");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Receita</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border p-4 rounded-lg shadow-md"
      >
        <div>
          <label className="block text-sm font-medium">Título</label>
          <input
            {...register("title", { required: true })}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Ingredientes (separados por vírgula)
          </label>
          <input
            {...register("ingredients", { required: true })}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Passos (separados por vírgula)
          </label>
          <input
            {...register("steps", { required: true })}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Salvar Receita
        </button>
      </form>
    </div>
  );
}
