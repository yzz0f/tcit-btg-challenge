import { configureStore } from '@reduxjs/toolkit';
import { healthReducer } from './health/health.slice';

export const createStore = () =>
  configureStore({
    reducer: {
      health: healthReducer,
      // El slice `posts` se añade en la fase 5.
    },
  });

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
