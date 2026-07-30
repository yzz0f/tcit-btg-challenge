import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KEYWORDS_SEPARATOR } from '@tcit/shared';
import { Repository } from 'typeorm';
import { Post } from '../../domain/post';
import { PostRepositoryPort } from '../../domain/post-repository.port';
import { PostOrmEntity } from './post.orm-entity';

@Injectable()
export class TypeOrmPostRepository extends PostRepositoryPort {
  constructor(
    @InjectRepository(PostOrmEntity)
    private readonly repository: Repository<PostOrmEntity>,
  ) {
    super();
  }

  async save(post: Post): Promise<void> {
    await this.repository.save(this.toOrm(post));
  }

  async findAll(): Promise<Post[]> {
    const rows = await this.repository.find({ order: { createdAt: 'DESC' } });

    return rows.map((row) => this.toDomain(row));
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.repository.delete({ id });

    return (result.affected ?? 0) > 0;
  }

  private toOrm(post: Post): PostOrmEntity {
    const row = new PostOrmEntity();
    row.id = post.id;
    row.name = post.name;
    row.description = post.description;
    row.summary = post.summary;
    row.keywords = post.keywords.join(KEYWORDS_SEPARATOR);
    row.createdAt = post.createdAt;

    return row;
  }

  private toDomain(row: PostOrmEntity): Post {
    return Post.rehydrate({
      // SQL Server devuelve uniqueidentifier en mayúsculas; el contrato usa el UUID normalizado.
      id: row.id.toLowerCase(),
      name: row.name,
      description: row.description,
      summary: row.summary,
      keywords: this.toKeywords(row.keywords),
      createdAt: row.createdAt,
    });
  }

  /** La columna guarda las palabras clave unidas por coma; el dominio las usa como lista. */
  private toKeywords(stored: string | null): string[] {
    return (stored ?? '')
      .split(KEYWORDS_SEPARATOR)
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }
}
