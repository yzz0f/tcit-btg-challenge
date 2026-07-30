import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { checkHealth } from './health/health.slice';
import { PostForm } from './posts/post-form';
import { PostsFilter } from './posts/posts-filter';
import { PostsTable } from './posts/posts-table';
import { fetchPosts, selectError } from './posts/posts.slice';

export function App() {
  const dispatch = useAppDispatch();
  const healthStatus = useAppSelector((state) => state.health.status);
  const error = useAppSelector(selectError);

  useEffect(() => {
    dispatch(checkHealth());
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <main>
      <header>
        <h1>Gestión de Posts</h1>
        <span className={`badge ${healthStatus}`}>
          {healthStatus === 'ok' ? 'API conectada' : 'API no disponible'}
        </span>
      </header>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <PostForm />

      <section className="card">
        <h2>Posts</h2>
        <PostsFilter />
        <PostsTable />
      </section>
    </main>
  );
}

export default App;
