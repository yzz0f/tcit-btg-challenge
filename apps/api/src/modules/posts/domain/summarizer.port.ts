/**
 * Puerto de generación del resumen / palabras clave. Hoy lo implementa una
 * heurística local; cambiarlo por un servicio externo o un LLM no toca el dominio.
 */
export abstract class SummarizerPort {
  abstract summarize(text: string): Promise<string>;
}
