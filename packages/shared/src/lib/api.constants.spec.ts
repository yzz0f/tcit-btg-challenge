import { API_PREFIX, API_ROUTES } from './api.constants';

describe('api.constants', () => {
  it('expone el prefijo global del API', () => {
    expect(API_PREFIX).toBe('api');
  });

  it('construye la ruta de un post por id', () => {
    expect(API_ROUTES.postById('abc-123')).toBe('/posts/abc-123');
  });
});
