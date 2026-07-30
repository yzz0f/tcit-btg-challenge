/**
 * Contrato del recurso Post, compartido entre el API y el frontend.
 * Corresponde a los 4 campos del challenge: nombre, descripción, resumen y fecha de creación.
 */
export interface Post {
  id: string;
  name: string;
  description: string;
  /** Resumen generado automáticamente a partir de la descripción. */
  summary: string;
  /** ISO 8601. */
  createdAt: string;
}

/** Payload aceptado por `POST /api/posts`. */
export interface CreatePostDto {
  name: string;
  description: string;
}

/** Límites de validación, compartidos por el DTO del API y el formulario web. */
export const POST_LIMITS = {
  nameMaxLength: 120,
  descriptionMaxLength: 5000,
  summaryMaxLength: 280,
} as const;
