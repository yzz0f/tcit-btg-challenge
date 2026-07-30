import { CreatePost } from '../../application/create-post.use-case';
import { ListPosts } from '../../application/list-posts.use-case';
import { Post } from '../../domain/post';
import { INITIAL_POSTS } from './initial-posts';
import { PostsSeeder } from './posts.seeder';

const existingPost = Post.create({
  name: 'Ya existe',
  description: 'Contenido',
  summary: 'Resumen',
  keywords: ['clave'],
});

function seeder(existing: Post[]) {
  const listPosts = { execute: jest.fn().mockResolvedValue(existing) } as unknown as ListPosts;
  const createPost = {
    execute: jest.fn().mockResolvedValue(existingPost),
  } as unknown as CreatePost;

  return { instance: new PostsSeeder(listPosts, createPost), createPost };
}

describe('PostsSeeder', () => {
  it('siembra los datos iniciales cuando la tabla está vacía', async () => {
    const { instance, createPost } = seeder([]);

    await expect(instance.run()).resolves.toBe(INITIAL_POSTS.length);
    expect(createPost.execute).toHaveBeenCalledTimes(INITIAL_POSTS.length);
    expect(createPost.execute).toHaveBeenCalledWith(INITIAL_POSTS[0]);
  });

  it('no siembra nada si ya hay posts', async () => {
    const { instance, createPost } = seeder([existingPost]);

    await expect(instance.run()).resolves.toBe(0);
    expect(createPost.execute).not.toHaveBeenCalled();
  });

  it('deja que el summarizer genere el resumen: los datos iniciales no lo definen', () => {
    for (const post of INITIAL_POSTS) {
      expect(Object.keys(post).sort()).toEqual(['description', 'name']);
    }
  });
});
