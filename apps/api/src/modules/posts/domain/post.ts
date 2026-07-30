import { randomUUID } from 'node:crypto';

/**
 * Modelo de dominio del Post. No conoce TypeORM, HTTP ni el framework:
 * solo los datos y las reglas propias del post.
 */
export class Post {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly summary: string,
    readonly createdAt: Date,
  ) {}

  /** Crea un post nuevo: el id y la fecha de creación los define el dominio. */
  static create(input: { name: string; description: string; summary: string }): Post {
    return new Post(
      randomUUID(),
      input.name.trim(),
      input.description.trim(),
      input.summary,
      new Date(),
    );
  }

  /** Reconstruye un post ya persistido, sin volver a aplicar las reglas de creación. */
  static rehydrate(input: {
    id: string;
    name: string;
    description: string;
    summary: string;
    createdAt: Date;
  }): Post {
    return new Post(input.id, input.name, input.description, input.summary, input.createdAt);
  }
}
