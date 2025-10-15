"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type Form = { email: string; name: string; password: string; };

export default function LoginPage() {
  const { register, handleSubmit } = useForm<Form>();
  const router = useRouter();

  const onSubmit = async (data: Form) => {
    const res = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/auth/login");
    else alert("Register failed");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-md mx-auto">
      <input {...register("email")} placeholder="dev@ex.com" />
      <input {...register("name")} placeholder="Name" />
      <input {...register("password")} type="password" placeholder="***" />
      <button type="submit">Registrar</button>
    </form>
  );
}
