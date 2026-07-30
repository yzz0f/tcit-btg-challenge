import { POST_LIMITS } from '@tcit/shared';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePostsTable1730000000000 implements MigrationInterface {
  name = 'CreatePostsTable1730000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          { name: 'id', type: 'uniqueidentifier', isPrimary: true },
          { name: 'name', type: 'nvarchar', length: `${POST_LIMITS.nameMaxLength}` },
          // nvarchar admite hasta 4000 caracteres; MAX cubre el límite del contrato (5000).
          { name: 'description', type: 'nvarchar', length: 'MAX' },
          { name: 'summary', type: 'nvarchar', length: `${POST_LIMITS.summaryMaxLength}` },
          { name: 'createdAt', type: 'datetime2', precision: 3 },
        ],
        indices: [{ name: 'IX_posts_createdAt', columnNames: ['createdAt'] }],
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('posts', true);
  }
}
