/**
 * Contrato del recurso Post, compartido entre el API y el frontend.
 * Los campos del challenge son: nombre, descripcion, resumen y fechaCreacion.
 */
export interface Post {
  id: string;
  nombre: string;
  descripcion: string;
  /** Resumen generado automáticamente a partir de la descripción. */
  resumen: string;
  /** ISO 8601. */
  fechaCreacion: string;
}

/** Payload aceptado por `POST /api/posts`. */
export interface CreatePostInput {
  nombre: string;
  descripcion: string;
}

/** Límites de validación, compartidos por el DTO del API y el formulario web. */
export const POST_LIMITS = {
  nombreMaxLength: 120,
  descripcionMaxLength: 5000,
  resumenMaxLength: 280,
} as const;
