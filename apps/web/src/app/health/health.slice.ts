import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_ROUTES } from '@tcit/shared';
import { apiFetch } from '../../lib/api-client';

export type HealthStatus = 'idle' | 'loading' | 'ok' | 'error';

export interface HealthState {
  status: HealthStatus;
  error: string | null;
}

const initialState: HealthState = {
  status: 'idle',
  error: null,
};

export const checkHealth = createAsyncThunk('health/check', () =>
  apiFetch<{ status: string; service: string }>(API_ROUTES.health),
);

export const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkHealth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkHealth.fulfilled, (state) => {
        state.status = 'ok';
      })
      .addCase(checkHealth.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'No se pudo contactar el API';
      });
  },
});

export const healthReducer = healthSlice.reducer;
