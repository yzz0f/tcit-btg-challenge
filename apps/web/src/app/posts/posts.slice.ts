import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { API_ROUTES, CreatePostDto, Post } from '@tcit/shared';
import { apiFetch } from '../../lib/api-client';
import type { RootState } from '../store';

export type PostsStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface PostsState {
  items: Post[];
  status: PostsStatus;
  /** Texto del filtro local por nombre. */
  filter: string;
  creating: boolean;
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  status: 'idle',
  filter: '',
  creating: false,
  error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetch', () => apiFetch<Post[]>(API_ROUTES.posts));

export const createPost = createAsyncThunk('posts/create', (input: CreatePostDto) =>
  apiFetch<Post>(API_ROUTES.posts, { method: 'POST', body: JSON.stringify(input) }),
);

export const deletePost = createAsyncThunk('posts/delete', async (id: string) => {
  await apiFetch<void>(API_ROUTES.postById(id), { method: 'DELETE' });

  return id;
});

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    filterChanged(state, action: { payload: string }) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'ready';
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'No se pudieron cargar los posts';
      })
      .addCase(createPost.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.creating = false;
        state.items.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message ?? 'No se pudo crear el post';
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.error.message ?? 'No se pudo eliminar el post';
      });
  },
});

export const { filterChanged } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;

const selectPosts = (state: RootState) => state.posts;

export const selectStatus = (state: RootState) => selectPosts(state).status;
export const selectError = (state: RootState) => selectPosts(state).error;
export const selectFilter = (state: RootState) => selectPosts(state).filter;
export const selectIsCreating = (state: RootState) => selectPosts(state).creating;
export const selectTotal = (state: RootState) => selectPosts(state).items.length;

/** Filtro local por nombre, sin distinguir mayúsculas ni espacios sobrantes. */
export const selectVisiblePosts = createSelector(
  [(state: RootState) => selectPosts(state).items, selectFilter],
  (items, filter) => {
    const term = filter.trim().toLowerCase();

    return term ? items.filter((post) => post.name.toLowerCase().includes(term)) : items;
  },
);
