import { DataSource } from 'typeorm';
import { databaseOptions } from './config/database.config';

/** DataSource para el CLI de TypeORM (`migration:show`, `migration:generate`). */
export default new DataSource(databaseOptions());
