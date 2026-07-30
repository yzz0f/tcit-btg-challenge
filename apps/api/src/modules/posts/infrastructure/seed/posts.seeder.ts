import { Injectable, Logger } from '@nestjs/common';
import { CreatePost } from '../../application/create-post.use-case';
import { ListPosts } from '../../application/list-posts.use-case';
import { INITIAL_POSTS } from './initial-posts';

/**
 * Carga los datos iniciales reusando el caso de uso `CreatePost`, así los posts sembrados
 * pasan por las mismas reglas y el mismo summarizer que los creados desde la aplicación.
 * Es idempotente: si ya hay posts, no hace nada.
 */
@Injectable()
export class PostsSeeder {
  private readonly logger = new Logger(PostsSeeder.name);

  constructor(
    private readonly listPosts: ListPosts,
    private readonly createPost: CreatePost,
  ) {}

  /** Devuelve cuántos posts se sembraron (0 si la tabla ya tenía datos). */
  async run(): Promise<number> {
    const existing = await this.listPosts.execute();

    if (existing.length > 0) {
      this.logger.log(`La tabla ya tiene ${existing.length} post(s): no se siembran datos`);

      return 0;
    }

    for (const post of INITIAL_POSTS) {
      await this.createPost.execute(post);
    }

    this.logger.log(`Datos iniciales cargados: ${INITIAL_POSTS.length} post(s)`);

    return INITIAL_POSTS.length;
  }
}
