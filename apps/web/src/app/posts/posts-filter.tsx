import { FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { filterChanged, selectFilter, selectTotal, selectVisiblePosts } from './posts.slice';

/** Filtro local por nombre: no llama al API, filtra lo que ya está en el store. */
export function PostsFilter() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const visible = useAppSelector(selectVisiblePosts).length;
  const total = useAppSelector(selectTotal);

  return (
    <form className="filter" onSubmit={(event: FormEvent) => event.preventDefault()} role="search">
      <label htmlFor="filter">Filtro de nombre</label>
      <input
        id="filter"
        value={filter}
        placeholder="Buscar por nombre"
        onChange={(event) => dispatch(filterChanged(event.target.value))}
      />
      {filter.trim() && (
        <button type="button" onClick={() => dispatch(filterChanged(''))}>
          Limpiar
        </button>
      )}
      <span className="count">
        {visible} de {total}
      </span>
    </form>
  );
}
