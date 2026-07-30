import { POST_LIMITS } from '@tcit/shared';
import { KeywordSummarizer } from './keyword.summarizer';

describe('KeywordSummarizer', () => {
  const summarizer = new KeywordSummarizer();

  it('usa la primera oración como resumen, sin las palabras clave', async () => {
    const { summary } = await summarizer.summarize(
      'El despliegue usa contenedores. Los contenedores simplifican el despliegue en la nube.',
    );

    expect(summary).toBe('El despliegue usa contenedores.');
  });

  it('devuelve las palabras clave como lista ordenada por frecuencia', async () => {
    const { keywords } = await summarizer.summarize('nube nube nube servidor servidor contenedor');

    expect(keywords).toEqual(['nube', 'servidor', 'contenedor']);
  });

  it('ignora palabras vacías y muy cortas', async () => {
    const { keywords } = await summarizer.summarize('Esto es para todos los que están con la nube');

    expect(keywords).toEqual(['nube']);
  });

  it('no devuelve más palabras clave que el límite del contrato', async () => {
    const { keywords } = await summarizer.summarize(
      'nube servidor contenedor despliegue migracion resumen entidad puerto adaptador',
    );

    expect(keywords).toHaveLength(POST_LIMITS.maxKeywords);
  });

  it('respeta el largo de la columna que guarda las palabras clave', async () => {
    const { keywords } = await summarizer.summarize(
      Array.from({ length: 5 }, (_, i) => `${'palabra'.repeat(10)}${i}`).join(' '),
    );

    expect(keywords.join(',').length).toBeLessThanOrEqual(POST_LIMITS.keywordsMaxLength);
  });

  it('respeta el largo del resumen', async () => {
    const { summary } = await summarizer.summarize('palabra '.repeat(200));

    expect(summary.length).toBeLessThanOrEqual(POST_LIMITS.summaryMaxLength);
  });

  it('devuelve resumen vacío y sin palabras clave si no hay descripción', async () => {
    expect(await summarizer.summarize('   ')).toEqual({ summary: '', keywords: [] });
  });
});
