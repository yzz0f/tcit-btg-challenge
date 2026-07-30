import { Controller, Get } from '@nestjs/common';
import { API_ROUTES } from '@tcit/shared';

export interface HealthResponse {
  status: 'ok';
  service: 'api';
}

@Controller(API_ROUTES.health)
export class HealthController {
  @Get()
  check(): HealthResponse {
    return { status: 'ok', service: 'api' };
  }
}
