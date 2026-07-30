import { POST_LIMITS } from '@tcit/shared';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * Las palabras clave pasan a su propia columna: antes venían concatenadas dentro del
 * resumen. Se guardan unidas por coma porque SQL Server no tiene tipo lista.
 */
export class AddKeywordsToPosts1730000100000 implements MigrationInterface {
  name = 'AddKeywordsToPosts1730000100000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'posts',
      new TableColumn({
        name: 'keywords',
        type: 'nvarchar',
        length: `${POST_LIMITS.keywordsMaxLength}`,
        default: "''",
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('posts', 'keywords');
  }
}
