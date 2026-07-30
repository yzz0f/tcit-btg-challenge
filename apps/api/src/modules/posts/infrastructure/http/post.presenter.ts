import { Post as PostContract } from '@tcit/shared';
import { Post } from '../../domain/post';

/** Traduce el modelo de dominio al contrato que consume el frontend. */
export function toPostResponse(post: Post): PostContract {
  return {
    id: post.id,
    name: post.name,
    description: post.description,
    summary: post.summary,
    keywords: post.keywords,
    createdAt: post.createdAt.toISOString(),
  };
}
