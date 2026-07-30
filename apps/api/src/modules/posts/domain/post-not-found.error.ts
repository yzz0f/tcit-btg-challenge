/** Error de dominio; la capa HTTP lo traduce a un 404. */
export class PostNotFoundError extends Error {
  constructor(readonly postId: string) {
    super(`No existe un post con id ${postId}`);
    this.name = 'PostNotFoundError';
  }
}
