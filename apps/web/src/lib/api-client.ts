const DEFAULT_API_URL = 'http://localhost:3000/api';

/** Base del API; se sobreescribe con VITE_API_URL (ver .env.example). */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;

/**
 * Wrapper mínimo sobre fetch: resuelve la ruta contra API_BASE_URL, envía/recibe JSON
 * y convierte respuestas no-2xx en errores. Reutilizado por los thunks de la fase 5.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`${init?.method ?? 'GET'} ${path} falló con status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
