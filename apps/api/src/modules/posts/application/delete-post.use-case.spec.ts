import { Post } from '../domain/post';
import { PostNotFoundError } from '../domain/post-not-found.error';
import { PostRepositoryPort } from '../domain/post-repository.port';
import { DeletePost } from './delete-post.use-case';

class StubRepository extends PostRepositoryPort {
  constructor(private readonly existe: boolean) {
    super();
  }

  async save(): Promise<void> {
    // no usado en estas pruebas
  }

  async findAll(): Promise<Post[]> {
    return [];
  }

  async deleteById(): Promise<boolean> {
    return this.existe;
  }
}

describe('DeletePost', () => {
  it('elimina el post cuando existe', async () => {
    await expect(new DeletePost(new StubRepository(true)).execute('id-1')).resolves.toBeUndefined();
  });

  it('falla con PostNotFoundError cuando no existe', async () => {
    await expect(new DeletePost(new StubRepository(false)).execute('id-1')).rejects.toThrow(
      PostNotFoundError,
    );
  });
});
