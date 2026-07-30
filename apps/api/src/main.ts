import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { API_PREFIX } from '@tcit/shared';
import { AppModule } from './app/app.module';
import { PostsSeeder } from './modules/posts/infrastructure/seed/posts.seeder';

const DEFAULT_PORT = 3000;
const DEFAULT_WEB_ORIGIN = 'http://localhost:4200';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(API_PREFIX);

  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? DEFAULT_WEB_ORIGIN,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Datos iniciales: solo si se pide explícitamente y la tabla está vacía.
  if (process.env.SEED_ON_BOOT === 'true') {
    await app.get(PostsSeeder).run();
  }

  const port = Number(process.env.API_PORT ?? process.env.PORT ?? DEFAULT_PORT);
  await app.listen(port);

  Logger.log(`API escuchando en http://localhost:${port}/${API_PREFIX}`, 'Bootstrap');
}

bootstrap();
