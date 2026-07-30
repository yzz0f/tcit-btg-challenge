import { Post } from './post';

/**
 * Puerto de persistencia. Se declara como clase abstracta para usarla también
 * como token de inyección en Nest sin acoplar el dominio al adaptador.
 */
export abstract class PostRepositoryPort {
  abstract save(post: Post): Promise<void>;

  /** Posts ordenados del más reciente al más antiguo. */
  abstract findAll(): Promise<Post[]>;

  /** `true` si existía y se eliminó; `false` si no había nada con ese id. */
  abstract deleteById(id: string): Promise<boolean>;
}
