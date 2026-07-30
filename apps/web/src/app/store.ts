import { configureStore } from '@reduxjs/toolkit';
import { healthReducer } from './health/health.slice';
import { postsReducer } from './posts/posts.slice';

export const createStore = () =>
  configureStore({
    reducer: {
      health: healthReducer,
      posts: postsReducer,
    },
  });

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
