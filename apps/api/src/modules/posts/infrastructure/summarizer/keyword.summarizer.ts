import { Injectable } from '@nestjs/common';
import { POST_LIMITS } from '@tcit/shared';
import { PostSummary, SummarizerPort } from '../../domain/summarizer.port';

/** Palabras sin valor semántico que no deben salir como palabras clave. */
const STOPWORDS = new Set([
  'para',
  'pero',
  'como',
  'este',
  'esta',
  'esto',
  'esos',
  'esas',
  'entre',
  'sobre',
  'desde',
  'hasta',
  'cuando',
  'donde',
  'porque',
  'aunque',
  'también',
  'todos',
  'todas',
  'otros',
  'otras',
  'cada',
  'muy',
  'más',
  'menos',
  'ser',
  'son',
  'está',
  'están',
  'tiene',
  'tienen',
  'hacer',
  'puede',
  'pueden',
  'debe',
  'deben',
  'the',
  'and',
  'for',
  'with',
  'that',
  'this',
  'from',
  'have',
  'has',
  'are',
  'was',
  'were',
  'will',
  'can',
  'not',
]);

const MIN_KEYWORD_LENGTH = 4;

/**
 * Genera el resumen y las palabras clave a partir de la descripción: el resumen es la
 * primera oración, y las palabras clave son los términos más frecuentes del texto.
 * Es determinista, sin dependencias externas y reemplazable por otro adaptador del puerto
 * (por ejemplo un LLM).
 */
@Injectable()
export class KeywordSummarizer extends SummarizerPort {
  async summarize(text: string): Promise<PostSummary> {
    const normalized = text.replace(/\s+/g, ' ').trim();

    if (!normalized) {
      return { summary: '', keywords: [] };
    }

    return {
      summary: this.firstSentence(normalized),
      keywords: this.keywords(normalized),
    };
  }

  private firstSentence(text: string): string {
    const [sentence] = text.split(/(?<=[.!?])\s/);
    const summary = sentence ?? text;

    return summary.length <= POST_LIMITS.summaryMaxLength
      ? summary
      : `${summary.slice(0, POST_LIMITS.summaryMaxLength - 1).trimEnd()}…`;
  }

  private keywords(text: string): string[] {
    const frequencies = new Map<string, number>();

    for (const word of text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []) {
      if (word.length < MIN_KEYWORD_LENGTH || STOPWORDS.has(word)) {
        continue;
      }

      frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
    }

    const ranked = [...frequencies.entries()]
      .sort(([wordA, countA], [wordB, countB]) => countB - countA || wordA.localeCompare(wordB))
      .map(([word]) => word);

    return this.fitToColumn(ranked.slice(0, POST_LIMITS.maxKeywords));
  }

  /** Descarta las últimas palabras si no caben en la columna que las persiste. */
  private fitToColumn(keywords: string[]): string[] {
    const fitting: string[] = [];

    for (const keyword of keywords) {
      const length = [...fitting, keyword].join(',').length;

      if (length > POST_LIMITS.keywordsMaxLength) {
        break;
      }

      fitting.push(keyword);
    }

    return fitting;
  }
}
