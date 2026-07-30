/** Prefijo global del API (NestJS `setGlobalPrefix`). */
export const API_PREFIX = 'api';

/** Rutas del API, para no duplicar strings entre backend y frontend. */
export const API_ROUTES = {
  health: '/health',
  posts: '/posts',
  postById: (id: string) => `/posts/${id}`,
} as const;
