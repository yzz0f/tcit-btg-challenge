import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from '../config/database.config';
import { PostsModule } from '../modules/posts/posts.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      // Aplica las migraciones al arrancar: el contenedor queda listo sin pasos manuales.
      useFactory: () => ({ ...databaseOptions(), migrationsRun: true, autoLoadEntities: false }),
    }),
    HealthModule,
    PostsModule,
  ],
})
export class AppModule {}
