import { checkHealth, healthReducer, type HealthState } from './health.slice';

const initialState: HealthState = { status: 'idle', error: null };

describe('healthSlice', () => {
  it('marca loading al iniciar la verificación', () => {
    const state = healthReducer(initialState, { type: checkHealth.pending.type });
    expect(state.status).toBe('loading');
  });

  it('marca ok cuando el API responde', () => {
    const state = healthReducer(initialState, { type: checkHealth.fulfilled.type });
    expect(state.status).toBe('ok');
  });

  it('guarda el mensaje de error cuando el API falla', () => {
    const state = healthReducer(initialState, {
      type: checkHealth.rejected.type,
      error: { message: 'boom' },
    });
    expect(state).toEqual({ status: 'error', error: 'boom' });
  });
});
