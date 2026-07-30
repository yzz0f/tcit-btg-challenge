import { DataSourceOptions } from 'typeorm';
import { PostOrmEntity } from '../modules/posts/infrastructure/persistence/post.orm-entity';
import { CreatePostsTable1730000000000 } from '../migrations/1730000000000-create-posts-table';
import { AddKeywordsToPosts1730000100000 } from '../migrations/1730000100000-add-keywords-to-posts';

/**
 * Opciones de conexión compartidas por la app y el CLI de TypeORM.
 * `synchronize` queda en false a propósito: el esquema lo definen las migraciones.
 */
export function databaseOptions(): DataSourceOptions {
  return {
    type: 'mssql',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 1433),
    username: process.env.DB_USER ?? 'sa',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'btg_posts',
    entities: [PostOrmEntity],
    migrations: [CreatePostsTable1730000000000, AddKeywordsToPosts1730000100000],
    synchronize: false,
    options: {
      // El contenedor de SQL Server usa un certificado autofirmado.
      encrypt: true,
      trustServerCertificate: true,
    },
  };
}
