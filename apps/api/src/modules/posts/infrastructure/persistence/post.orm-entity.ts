import { POST_LIMITS } from '@tcit/shared';
import { Column, Entity, PrimaryColumn } from 'typeorm';

/** Representación en SQL Server. Separada del modelo de dominio a propósito. */
@Entity({ name: 'posts' })
export class PostOrmEntity {
  @PrimaryColumn({ type: 'uniqueidentifier' })
  id!: string;

  @Column({ type: 'nvarchar', length: POST_LIMITS.nameMaxLength })
  name!: string;

  // nvarchar admite hasta 4000 caracteres; para el límite del contrato hace falta MAX.
  @Column({ type: 'nvarchar', length: 'MAX' })
  description!: string;

  @Column({ type: 'nvarchar', length: POST_LIMITS.summaryMaxLength })
  summary!: string;

  /** Palabras clave unidas por coma: SQL Server no tiene tipo lista. */
  @Column({ type: 'nvarchar', length: POST_LIMITS.keywordsMaxLength, default: '' })
  keywords!: string;

  @Column({ type: 'datetime2', precision: 3 })
  createdAt!: Date;
}
