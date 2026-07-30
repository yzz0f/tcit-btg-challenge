import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './app';
import { createStore } from './store';

function renderApp() {
  return render(
    <Provider store={createStore()}>
      <App />
    </Provider>,
  );
}

describe('App', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok', service: 'api' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza el título de la aplicación', async () => {
    renderApp();
    expect(screen.getByRole('heading', { name: 'Gestión de Posts' })).toBeTruthy();
    // El health check se dispara al montar; se espera para no dejar updates fuera de act().
    await screen.findByText('API conectada');
  });

  it('reporta la conexión con el API tras el health check', async () => {
    renderApp();
    expect(await screen.findByText('API conectada')).toBeTruthy();
  });
});
