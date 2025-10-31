
import { useEffect, useState } from "react";
import { apiFetch } from "./globalFetch";

export function useSession() {
  const [user, setUser] = useState<{ id: string; email: string, name: string } | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await apiFetch(`/auth/profile`);
        if (res) {
          setUser(res);
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      }
    }

    fetchSession();
  }, []);

  return { user };
}
