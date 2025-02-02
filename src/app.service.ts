import { Injectable, OnModuleInit } from '@nestjs/common';
import { SeedService } from './database/seed.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  getHello(): string {
    return 'Hello From NestJS!';
  }

  async onModuleInit() {
    await this.seedService.seedVehicles();
  }
}
