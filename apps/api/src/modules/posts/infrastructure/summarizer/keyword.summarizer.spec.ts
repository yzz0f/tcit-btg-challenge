import { POST_LIMITS } from '@tcit/shared';
import { KeywordSummarizer } from './keyword.summarizer';

describe('KeywordSummarizer', () => {
  const summarizer = new KeywordSummarizer();

  it('devuelve la primera oración con las palabras clave', async () => {
    const summary = await summarizer.summarize(
      'El despliegue usa contenedores. Los contenedores simplifican el despliegue en la nube.',
    );

    expect(summary).toContain('El despliegue usa contenedores.');
    expect(summary).toContain('Palabras clave: ');
    expect(summary).toContain('contenedores');
    expect(summary).toContain('despliegue');
  });

  it('ordena las palabras clave por frecuencia', async () => {
    const summary = await summarizer.summarize('nube nube nube servidor servidor contenedor');
    const keywords = summary.split('Palabras clave: ')[1];

    expect(keywords.startsWith('nube, servidor, contenedor')).toBe(true);
  });

  it('ignora palabras vacías y muy cortas al elegir las palabras clave', async () => {
    const summary = await summarizer.summarize('Esto es para todos los que están con la nube');
    const keywords = summary.split('Palabras clave: ')[1].split(', ');

    expect(keywords).toEqual(['nube']);
  });

  it('respeta el límite de longitud del resumen', async () => {
    const summary = await summarizer.summarize('palabra '.repeat(200));

    expect(summary.length).toBeLessThanOrEqual(POST_LIMITS.summaryMaxLength);
  });

  it('devuelve vacío si no hay descripción', async () => {
    expect(await summarizer.summarize('   ')).toBe('');
  });
});
