import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePost } from './application/create-post.use-case';
import { DeletePost } from './application/delete-post.use-case';
import { ListPosts } from './application/list-posts.use-case';
import { PostRepositoryPort } from './domain/post-repository.port';
import { SummarizerPort } from './domain/summarizer.port';
import { PostsController } from './infrastructure/http/posts.controller';
import { PostOrmEntity } from './infrastructure/persistence/post.orm-entity';
import { TypeOrmPostRepository } from './infrastructure/persistence/typeorm-post.repository';
import { PostsSeeder } from './infrastructure/seed/posts.seeder';
import { KeywordSummarizer } from './infrastructure/summarizer/keyword.summarizer';

/** Une los puertos del dominio con sus adaptadores concretos. */
@Module({
  imports: [TypeOrmModule.forFeature([PostOrmEntity])],
  controllers: [PostsController],
  providers: [
    CreatePost,
    ListPosts,
    DeletePost,
    PostsSeeder,
    { provide: PostRepositoryPort, useClass: TypeOrmPostRepository },
    { provide: SummarizerPort, useClass: KeywordSummarizer },
  ],
  exports: [PostsSeeder],
})
export class PostsModule {}
