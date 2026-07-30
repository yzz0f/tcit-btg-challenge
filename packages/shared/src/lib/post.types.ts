/**
 * Contrato del recurso Post, compartido entre el API y el frontend.
 * Corresponde a los 4 campos del challenge: nombre, descripción, resumen / palabras clave
 * y fecha de creación.
 */
export interface Post {
  id: string;
  name: string;
  description: string;
  /** Resumen generado automáticamente a partir de la descripción. */
  summary: string;
  /**
   * Palabras clave generadas junto con el resumen. En SQL Server se guardan en una sola
   * columna separadas por coma; el contrato las expone siempre como lista.
   */
  keywords: string[];
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
  /** Cantidad de palabras clave que genera el summarizer. */
  maxKeywords: 5,
  /** Longitud de la columna que guarda las palabras clave unidas por coma. */
  keywordsMaxLength: 200,
} as const;

/** Separador usado para persistir las palabras clave en una sola columna. */
export const KEYWORDS_SEPARATOR = ',';
