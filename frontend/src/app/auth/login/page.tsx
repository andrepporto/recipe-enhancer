"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/api/globalFetch";

type Form = { email: string; password: string; };

export default function LoginPage() {
  const { register, handleSubmit } = useForm<Form>();
  const router = useRouter();

  const onSubmit = async (data: Form) => {
    const res = await apiFetch('/auth/login', {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!!res) router.push("/recipes");
    else alert("Login failed");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-md mx-auto">
      <input {...register("email")} placeholder="Email" />
      <input {...register("password")} type="password" placeholder="Senha" />
      <button type="submit">Entrar</button>
    </form>
  );
}
