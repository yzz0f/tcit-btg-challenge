import { CreatePostCommand } from '../../application/create-post.use-case';

/**
 * Datos iniciales: citas de películas. La cita va como primera oración (es la que aparece
 * en el resumen) y el contexto le da material al extractor de palabras clave.
 * El `summary` no se define acá: lo genera el summarizer al sembrar, igual que cuando un
 * post se crea desde la aplicación.
 */
export const INITIAL_POSTS: CreatePostCommand[] = [
  {
    name: 'V de Vendetta',
    description:
      'Detrás de esta máscara hay más que carne; detrás de esta máscara hay una idea, y las ' +
      'ideas son a prueba de balas. La máscara de V convirtió una idea en símbolo de protesta, ' +
      'y el símbolo sobrevive a la persona que lo usa.',
  },
  {
    name: 'El club de la pelea',
    description:
      'La primera regla del club de la pelea es: no se habla del club de la pelea. Las reglas ' +
      'del club son el contrato secreto que sostiene al grupo, y romper el silencio destruye ' +
      'el club entero.',
  },
  {
    name: 'Matrix',
    description:
      'Tomas la pastilla azul y la historia termina; tomas la pastilla roja y te quedas en el ' +
      'país de las maravillas. La elección entre las dos pastillas resume la película: aceptar ' +
      'la simulación cómoda o enfrentar la realidad.',
  },
  {
    name: 'Blade Runner',
    description:
      'Todos esos momentos se perderán en el tiempo, como lágrimas en la lluvia. El monólogo ' +
      'final del replicante convierte la memoria en el único rastro de una vida, y la lluvia ' +
      'en la metáfora de esa memoria que se borra.',
  },
  {
    name: 'El Padrino',
    description:
      'Le haré una oferta que no podrá rechazar. La oferta de la familia Corleone nunca es una ' +
      'negociación: es poder disfrazado de cortesía, y rechazar la oferta no figura entre las ' +
      'opciones.',
  },
  {
    name: 'Gladiador',
    description:
      'Lo que hacemos en la vida tiene su eco en la eternidad. La frase resume la motivación ' +
      'del gladiador: si la vida se pierde en la arena, lo que queda es el eco de los actos ' +
      'y la memoria del nombre.',
  },
  {
    name: 'El Señor de los Anillos',
    description:
      'Incluso la persona más pequeña puede cambiar el curso del futuro. Todo lo que tenemos ' +
      'que decidir es qué hacer con el tiempo que se nos ha dado, y el futuro depende de esa ' +
      'decisión pequeña repetida cada día.',
  },
  {
    name: 'Casablanca',
    description:
      'Presiento que este es el comienzo de una gran amistad. El final de Casablanca cambia el ' +
      'romance por la amistad, y ese comienzo improbable se volvió una de las últimas frases ' +
      'más citadas del cine.',
  },
  {
    name: 'Apocalypse Now',
    description:
      'Me encanta el olor del napalm por la mañana; huele a victoria. El napalm y la mañana ' +
      'quedan unidos en la escena más incómoda de la película: la guerra narrada como una ' +
      'rutina cómoda para quien la ordena.',
  },
  {
    name: 'Terminator 2',
    description:
      'No hay destino más que el que nosotros mismos creamos. La película insiste en que el ' +
      'destino no está escrito: si el futuro se puede cambiar, entonces el futuro es una ' +
      'decisión y no una condena.',
  },
];
