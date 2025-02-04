import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AzureStorageModule } from '../azure-storage/azure-storage.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';
import { AdminController } from './admin.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    AzureStorageModule,
    PaginationModule,
    LoggerModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
