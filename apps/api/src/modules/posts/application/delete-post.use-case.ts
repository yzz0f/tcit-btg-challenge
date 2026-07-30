import { Injectable } from '@nestjs/common';
import { PostNotFoundError } from '../domain/post-not-found.error';
import { PostRepositoryPort } from '../domain/post-repository.port';

@Injectable()
export class DeletePost {
  constructor(private readonly posts: PostRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.posts.deleteById(id);

    if (!deleted) {
      throw new PostNotFoundError(id);
    }
  }
}
