import { Post } from '@tcit/shared';
import {
  createPost,
  deletePost,
  fetchPosts,
  filterChanged,
  postsReducer,
  selectVisiblePosts,
  type PostsState,
} from './posts.slice';
import type { RootState } from '../store';

function post(id: string, name: string): Post {
  return {
    id,
    name,
    description: 'Contenido',
    summary: 'Resumen',
    keywords: ['clave'],
    createdAt: '2026-07-29T12:00:00.000Z',
  };
}

const initialState: PostsState = {
  items: [],
  status: 'idle',
  filter: '',
  creating: false,
  error: null,
};

const rootState = (posts: PostsState) => ({ posts }) as RootState;

describe('postsSlice', () => {
  it('guarda los posts al cargarlos', () => {
    const state = postsReducer(initialState, {
      type: fetchPosts.fulfilled.type,
      payload: [post('1', 'Matrix')],
    });

    expect(state.status).toBe('ready');
    expect(state.items).toHaveLength(1);
  });

  it('expone el error si la carga falla', () => {
    const state = postsReducer(initialState, {
      type: fetchPosts.rejected.type,
      error: { message: 'sin conexión' },
    });

    expect(state).toMatchObject({ status: 'error', error: 'sin conexión' });
  });

  it('agrega el post creado al inicio de la lista', () => {
    const withOne = { ...initialState, items: [post('1', 'Matrix')] };

    const state = postsReducer(withOne, {
      type: createPost.fulfilled.type,
      payload: post('2', 'Gladiador'),
    });

    expect(state.items.map((p) => p.id)).toEqual(['2', '1']);
    expect(state.creating).toBe(false);
  });

  it('quita el post eliminado', () => {
    const withTwo = { ...initialState, items: [post('1', 'Matrix'), post('2', 'Gladiador')] };

    const state = postsReducer(withTwo, { type: deletePost.fulfilled.type, payload: '1' });

    expect(state.items.map((p) => p.id)).toEqual(['2']);
  });

  it('filtra por nombre ignorando mayúsculas y espacios', () => {
    const state = postsReducer(
      { ...initialState, items: [post('1', 'Matrix'), post('2', 'Gladiador')] },
      filterChanged('  matr '),
    );

    expect(selectVisiblePosts(rootState(state)).map((p) => p.name)).toEqual(['Matrix']);
  });

  it('sin filtro devuelve todos los posts', () => {
    const state = { ...initialState, items: [post('1', 'Matrix'), post('2', 'Gladiador')] };

    expect(selectVisiblePosts(rootState(state))).toHaveLength(2);
  });
});
