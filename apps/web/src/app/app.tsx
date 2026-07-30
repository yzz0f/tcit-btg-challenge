import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { checkHealth } from './health/health.slice';
import { API_BASE_URL } from '../lib/api-client';

const MENSAJES: Record<string, string> = {
  idle: 'Sin verificar',
  loading: 'Verificando…',
  ok: 'API conectada',
  error: 'API no disponible',
};

export function App() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.health);

  useEffect(() => {
    dispatch(checkHealth());
  }, [dispatch]);

  return (
    <main>
      <h1>Gestión de Posts</h1>
      <p>
        Estado: <strong>{MENSAJES[status]}</strong>
      </p>
      <p>API: {API_BASE_URL}</p>
      {error && <p role="alert">{error}</p>}
      {/* El CRUD de posts se implementa en la fase 5. */}
    </main>
  );
}

export default App;
