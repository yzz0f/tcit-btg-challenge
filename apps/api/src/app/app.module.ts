import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';

@Module({
  // El módulo Posts (dominio/aplicación/infraestructura) se añade en la fase 3.
  imports: [HealthModule],
})
export class AppModule {}
