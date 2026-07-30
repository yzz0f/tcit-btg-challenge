import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import App from './app';
import { createStore } from './store';

const post = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Matrix',
  description: 'Tomas la pastilla azul y la historia termina.',
  summary: 'Tomas la pastilla azul y la historia termina. Palabras clave: pastilla, tomas',
  createdAt: '2026-07-29T12:00:00.000Z',
};

const otherPost = { ...post, id: '22222222-2222-4222-8222-222222222222', name: 'Gladiador' };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Responde según método y ruta, como lo haría el API. */
function stubApi(handlers: { get?: unknown[]; post?: unknown; delete?: number } = {}) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    const url = String(input);
    const method = init?.method ?? 'GET';

    if (url.endsWith('/health')) return json({ status: 'ok', service: 'api' });
    if (method === 'DELETE') return new Response(null, { status: handlers.delete ?? 204 });
    if (method === 'POST') return json(handlers.post ?? post, 201);

    return json(handlers.get ?? [post, otherPost]);
  });
}

function renderApp() {
  return render(
    <Provider store={createStore()}>
      <App />
    </Provider>,
  );
}

describe('App', () => {
  afterEach(() => vi.restoreAllMocks());

  it('lista los posts con su resumen y marca el API como conectada', async () => {
    stubApi();
    renderApp();

    expect(await screen.findByText('Matrix')).toBeTruthy();
    expect(screen.getAllByText(/Palabras clave: pastilla, tomas/)).toHaveLength(2);
    expect(screen.getByText('API conectada')).toBeTruthy();
  });

  it('filtra localmente por nombre', async () => {
    stubApi();
    renderApp();
    await screen.findByText('Matrix');

    await userEvent.type(screen.getByLabelText('Filtro de nombre'), 'gladi');

    expect(screen.queryByText('Matrix')).toBeNull();
    expect(screen.getByText('Gladiador')).toBeTruthy();
    expect(screen.getByText('1 de 2')).toBeTruthy();
  });

  it('crea un post y lo agrega a la tabla', async () => {
    stubApi({ get: [], post: { ...post, name: 'Casablanca' } });
    renderApp();
    await screen.findByText('Todavía no hay posts.');

    await userEvent.type(screen.getByLabelText('Nombre'), 'Casablanca');
    await userEvent.type(screen.getByLabelText('Descripción'), 'Una gran amistad.');
    await userEvent.click(screen.getByRole('button', { name: 'Crear post' }));

    expect(await screen.findByText('Casablanca')).toBeTruthy();
    // El formulario se limpia tras crear.
    expect(screen.getByLabelText('Nombre')).toHaveValue('');
  });

  it('no permite enviar el formulario vacío', async () => {
    stubApi({ get: [] });
    renderApp();
    await screen.findByText('Todavía no hay posts.');

    expect(screen.getByRole('button', { name: 'Crear post' })).toBeDisabled();
  });

  it('elimina un post de la tabla', async () => {
    stubApi();
    renderApp();
    await screen.findByText('Matrix');

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar Matrix' }));

    await waitFor(() => expect(screen.queryByText('Matrix')).toBeNull());
    expect(screen.getByText('Gladiador')).toBeTruthy();
  });

  it('muestra el error cuando la carga falla', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) =>
      String(input).endsWith('/health')
        ? json({ status: 'ok', service: 'api' })
        : json({ message: 'boom' }, 500),
    );
    renderApp();

    expect(await screen.findByRole('alert')).toBeTruthy();
  });
});
