import { Post } from '../domain/post';
import { PostRepositoryPort } from '../domain/post-repository.port';
import { SummarizerPort } from '../domain/summarizer.port';
import { CreatePost } from './create-post.use-case';

class InMemoryPostRepository extends PostRepositoryPort {
  readonly saved: Post[] = [];

  async save(post: Post): Promise<void> {
    this.saved.push(post);
  }

  async findAll(): Promise<Post[]> {
    return this.saved;
  }

  async deleteById(): Promise<boolean> {
    return true;
  }
}

class FakeSummarizer extends SummarizerPort {
  async summarize(text: string): Promise<string> {
    return `resumen de: ${text}`;
  }
}

describe('CreatePost', () => {
  let repository: InMemoryPostRepository;
  let useCase: CreatePost;

  beforeEach(() => {
    repository = new InMemoryPostRepository();
    useCase = new CreatePost(repository, new FakeSummarizer());
  });

  it('persiste el post con el resumen generado', async () => {
    const post = await useCase.execute({ name: 'Post 1', description: 'Hola como están' });

    expect(post.summary).toBe('resumen de: Hola como están');
    expect(repository.saved).toEqual([post]);
  });

  it('asigna id y fecha de creación', async () => {
    const post = await useCase.execute({ name: 'Post 1', description: 'Contenido' });

    expect(post.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(post.createdAt).toBeInstanceOf(Date);
  });

  it('recorta los espacios del nombre y la descripción', async () => {
    const post = await useCase.execute({ name: '  Post 1  ', description: '  Contenido  ' });

    expect(post.name).toBe('Post 1');
    expect(post.description).toBe('Contenido');
  });
});
