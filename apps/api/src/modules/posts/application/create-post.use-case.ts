import { Injectable } from '@nestjs/common';
import { Post } from '../domain/post';
import { PostRepositoryPort } from '../domain/post-repository.port';
import { SummarizerPort } from '../domain/summarizer.port';

export interface CreatePostCommand {
  name: string;
  description: string;
}

@Injectable()
export class CreatePost {
  constructor(
    private readonly posts: PostRepositoryPort,
    private readonly summarizer: SummarizerPort,
  ) {}

  async execute(command: CreatePostCommand): Promise<Post> {
    const { summary, keywords } = await this.summarizer.summarize(command.description);
    const post = Post.create({ ...command, summary, keywords });

    await this.posts.save(post);

    return post;
  }
}
