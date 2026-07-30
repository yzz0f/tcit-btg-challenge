/** Resultado de resumir una descripción: el resumen y sus palabras clave. */
export interface PostSummary {
  summary: string;
  keywords: string[];
}

/**
 * Puerto de generación del resumen / palabras clave. Hoy lo implementa una
 * heurística local; cambiarlo por un servicio externo o un LLM no toca el dominio.
 */
export abstract class SummarizerPort {
  abstract summarize(text: string): Promise<PostSummary>;
}
