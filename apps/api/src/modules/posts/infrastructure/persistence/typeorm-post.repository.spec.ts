import { Repository } from 'typeorm';
import { Post } from '../../domain/post';
import { PostOrmEntity } from './post.orm-entity';
import { TypeOrmPostRepository } from './typeorm-post.repository';

function fakeRepository(overrides: Partial<Repository<PostOrmEntity>> = {}) {
  return {
    save: jest.fn(),
    find: jest.fn().mockResolvedValue([]),
    delete: jest.fn().mockResolvedValue({ affected: 0 }),
    ...overrides,
  } as unknown as Repository<PostOrmEntity>;
}

describe('TypeOrmPostRepository', () => {
  it('guarda el post con las palabras clave unidas por coma', async () => {
    const orm = fakeRepository();
    const post = Post.create({
      name: 'Post 1',
      description: 'Contenido',
      summary: 'Resumen',
      keywords: ['nube', 'servidor'],
    });

    await new TypeOrmPostRepository(orm).save(post);

    expect(orm.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: post.id, name: 'Post 1', keywords: 'nube,servidor' }),
    );
  });

  it('normaliza el id y reconstruye las palabras clave como lista', async () => {
    const orm = fakeRepository({
      find: jest.fn().mockResolvedValue([
        {
          id: '349C31D4-B364-46BC-BED9-2C7BF450C736',
          name: 'Post 1',
          description: 'Contenido',
          summary: 'Resumen',
          keywords: 'nube,servidor',
          createdAt: new Date('2026-07-29T12:00:00.000Z'),
        },
      ]),
    } as Partial<Repository<PostOrmEntity>>);

    const [post] = await new TypeOrmPostRepository(orm).findAll();

    expect(post.id).toBe('349c31d4-b364-46bc-bed9-2c7bf450c736');
    expect(post.keywords).toEqual(['nube', 'servidor']);
  });

  it('devuelve una lista vacía si la columna de palabras clave está vacía', async () => {
    const orm = fakeRepository({
      find: jest.fn().mockResolvedValue([
        {
          id: '349c31d4-b364-46bc-bed9-2c7bf450c736',
          name: 'Post 1',
          description: 'Contenido',
          summary: 'Resumen',
          keywords: '',
          createdAt: new Date('2026-07-29T12:00:00.000Z'),
        },
      ]),
    } as Partial<Repository<PostOrmEntity>>);

    const [post] = await new TypeOrmPostRepository(orm).findAll();

    expect(post.keywords).toEqual([]);
  });

  it('informa si el delete no afectó filas', async () => {
    const orm = fakeRepository();

    await expect(new TypeOrmPostRepository(orm).deleteById('id-1')).resolves.toBe(false);
  });

  it('informa si el delete eliminó la fila', async () => {
    const orm = fakeRepository({ delete: jest.fn().mockResolvedValue({ affected: 1 }) } as Partial<
      Repository<PostOrmEntity>
    >);

    await expect(new TypeOrmPostRepository(orm).deleteById('id-1')).resolves.toBe(true);
  });
});
