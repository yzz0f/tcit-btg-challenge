import { FormEvent, useState } from 'react';
import { POST_LIMITS } from '@tcit/shared';
import { useAppDispatch, useAppSelector } from '../hooks';
import { createPost, selectIsCreating } from './posts.slice';

/** Formulario de creación: nombre y descripción. El resumen lo genera el backend. */
export function PostForm() {
  const dispatch = useAppDispatch();
  const creating = useAppSelector(selectIsCreating);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const isValid = name.trim().length > 0 && description.trim().length > 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!isValid || creating) {
      return;
    }

    const result = await dispatch(
      createPost({ name: name.trim(), description: description.trim() }),
    );

    if (createPost.fulfilled.match(result)) {
      setName('');
      setDescription('');
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} aria-labelledby="form-title">
      <h2 id="form-title">Nuevo post</h2>

      <label htmlFor="name">Nombre</label>
      <input
        id="name"
        value={name}
        maxLength={POST_LIMITS.nameMaxLength}
        placeholder="Título del post"
        onChange={(event) => setName(event.target.value)}
      />

      <label htmlFor="description">Descripción</label>
      <textarea
        id="description"
        value={description}
        rows={4}
        maxLength={POST_LIMITS.descriptionMaxLength}
        placeholder="Contenido del post; el resumen se genera automáticamente"
        onChange={(event) => setDescription(event.target.value)}
      />

      <button type="submit" disabled={!isValid || creating}>
        {creating ? 'Creando…' : 'Crear post'}
      </button>
    </form>
  );
}
