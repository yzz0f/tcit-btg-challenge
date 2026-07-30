import { Injectable } from '@nestjs/common';
import { Post } from '../domain/post';
import { PostRepositoryPort } from '../domain/post-repository.port';

@Injectable()
export class ListPosts {
  constructor(private readonly posts: PostRepositoryPort) {}

  execute(): Promise<Post[]> {
    return this.posts.findAll();
  }
}
