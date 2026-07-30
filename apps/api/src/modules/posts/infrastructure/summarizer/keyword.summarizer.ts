import { Injectable } from '@nestjs/common';
import { POST_LIMITS } from '@tcit/shared';
import { SummarizerPort } from '../../domain/summarizer.port';

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
const MAX_KEYWORDS = 5;
const SENTENCE_MAX_LENGTH = 140;
const KEYWORDS_LABEL = 'Palabras clave: ';

/**
 * Genera el resumen combinando la primera oración de la descripción con las
 * palabras clave más frecuentes. Es determinista, sin dependencias externas y
 * reemplazable por otro adaptador del puerto (por ejemplo un LLM).
 */
@Injectable()
export class KeywordSummarizer extends SummarizerPort {
  async summarize(text: string): Promise<string> {
    const normalized = text.replace(/\s+/g, ' ').trim();

    if (!normalized) {
      return '';
    }

    const sentence = this.firstSentence(normalized);
    const keywords = this.keywords(normalized);
    const summary = keywords.length
      ? `${sentence} ${KEYWORDS_LABEL}${keywords.join(', ')}`
      : sentence;

    return this.truncate(summary, POST_LIMITS.summaryMaxLength);
  }

  private firstSentence(text: string): string {
    const [sentence] = text.split(/(?<=[.!?])\s/);

    return this.truncate(sentence ?? text, SENTENCE_MAX_LENGTH);
  }

  private keywords(text: string): string[] {
    const frequencies = new Map<string, number>();

    for (const word of text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []) {
      if (word.length < MIN_KEYWORD_LENGTH || STOPWORDS.has(word)) {
        continue;
      }

      frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
    }

    return [...frequencies.entries()]
      .sort(([wordA, countA], [wordB, countB]) => countB - countA || wordA.localeCompare(wordB))
      .slice(0, MAX_KEYWORDS)
      .map(([word]) => word);
  }

  private truncate(text: string, maxLength: number): string {
    return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1).trimEnd()}…`;
  }
}
