
import { apiFetch } from "./globalFetch";
import useSWR from "swr";

export function useSession() {
  const { data: user, error } = useSWR('/auth/profile',
    () => apiFetch('/auth/profile').catch(() => null),
    { revalidateOnFocus: false }
  );
  return { user, isLoading: !error && !user };
}
