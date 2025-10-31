import { Recipe } from "@prisma/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type ApiRoutes = {
  '/recipes': Recipe[];
  '/recipes/:id': Recipe;
  '/auth/register': { success: boolean };
  '/auth/login': { success: boolean };
  '/auth/profile': {
    id: string;
    email: string;
    name: string;
};
};

type RouteParams<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof RouteParams<`/${Rest}`>]: string }
    : Path extends `${string}:${infer Param}`
      ? { [k in Param]: string }
      : Record<string, never>;

export async function apiFetch<
  Path extends keyof ApiRoutes,
  Response = ApiRoutes[Path]
>(
  path: Path,
  options?: RequestInit,
  params?: RouteParams<Path>
): Promise<Response> {
  const baseUrl = API_URL;

  let fullPath = path as string;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      fullPath = fullPath.replace(`:${key}`, value);
    }
  }

  const res = await fetch(`${baseUrl}${fullPath}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }

  return res.json() as Promise<Response>;
}
