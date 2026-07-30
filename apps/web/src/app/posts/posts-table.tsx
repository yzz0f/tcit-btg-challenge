import { Post } from '@tcit/shared';
import { useAppDispatch, useAppSelector } from '../hooks';
import { deletePost, selectFilter, selectStatus, selectVisiblePosts } from './posts.slice';

const dateFormat = new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' });

function PostRow({ post }: { post: Post }) {
  const dispatch = useAppDispatch();

  return (
    <tr>
      <td>
        <strong>{post.name}</strong>
        <span className="date">{dateFormat.format(new Date(post.createdAt))}</span>
      </td>
      <td>{post.description}</td>
      <td className="summary">{post.summary}</td>
      <td>
        <button
          type="button"
          className="danger"
          aria-label={`Eliminar ${post.name}`}
          onClick={() => dispatch(deletePost(post.id))}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}

export function PostsTable() {
  const posts = useAppSelector(selectVisiblePosts);
  const status = useAppSelector(selectStatus);
  const filter = useAppSelector(selectFilter);

  if (status === 'loading') {
    return <p className="empty">Cargando posts…</p>;
  }

  if (!posts.length) {
    return (
      <p className="empty">
        {filter.trim() ? 'Ningún post coincide con el filtro.' : 'Todavía no hay posts.'}
      </p>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
          <th scope="col">Resumen</th>
          <th scope="col">Acción</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </tbody>
    </table>
  );
}
