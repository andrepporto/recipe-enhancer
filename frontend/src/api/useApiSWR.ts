import useSWR, { SWRResponse } from 'swr';
import { apiFetch, ApiRoutes } from './globalFetch';

export function useApiSWR<Path extends keyof ApiRoutes>(
  path: Path
): SWRResponse<ApiRoutes[Path], Error> {
  return useSWR<ApiRoutes[Path], Error>(path, () => apiFetch(path));
}
