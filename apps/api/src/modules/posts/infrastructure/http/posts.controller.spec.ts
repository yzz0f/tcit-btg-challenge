import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreatePost } from '../../application/create-post.use-case';
import { DeletePost } from '../../application/delete-post.use-case';
import { ListPosts } from '../../application/list-posts.use-case';
import { Post } from '../../domain/post';
import { PostNotFoundError } from '../../domain/post-not-found.error';
import { PostsController } from './posts.controller';

const post = Post.rehydrate({
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Post 1',
  description: 'Contenido',
  summary: 'Resumen',
  keywords: ['nube', 'servidor'],
  createdAt: new Date('2026-07-29T12:00:00.000Z'),
});

describe('PostsController', () => {
  const listPosts = { execute: jest.fn() };
  const createPost = { execute: jest.fn() };
  const deletePost = { execute: jest.fn() };
  let controller: PostsController;

  beforeEach(async () => {
    jest.resetAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [PostsController],
    })
      .useMocker((token) => {
        if (token === ListPosts) return listPosts;
        if (token === CreatePost) return createPost;
        if (token === DeletePost) return deletePost;
        return undefined;
      })
      .compile();

    controller = moduleRef.get(PostsController);
  });

  it('lista los posts en el formato del contrato compartido', async () => {
    listPosts.execute.mockResolvedValue([post]);

    await expect(controller.list()).resolves.toEqual([
      {
        id: post.id,
        name: 'Post 1',
        description: 'Contenido',
        summary: 'Resumen',
        keywords: ['nube', 'servidor'],
        createdAt: '2026-07-29T12:00:00.000Z',
      },
    ]);
  });

  it('crea un post y devuelve el objeto creado', async () => {
    createPost.execute.mockResolvedValue(post);

    const response = await controller.create({ name: 'Post 1', description: 'Contenido' });

    expect(createPost.execute).toHaveBeenCalledWith({ name: 'Post 1', description: 'Contenido' });
    expect(response.id).toBe(post.id);
  });

  it('traduce PostNotFoundError a un 404', async () => {
    deletePost.execute.mockRejectedValue(new PostNotFoundError(post.id));

    await expect(controller.remove(post.id)).rejects.toThrow(NotFoundException);
  });

  it('elimina el post cuando existe', async () => {
    deletePost.execute.mockResolvedValue(undefined);

    await expect(controller.remove(post.id)).resolves.toBeUndefined();
  });
});
