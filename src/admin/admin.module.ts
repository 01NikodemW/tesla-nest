import { Get, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AzureStorageModule } from '../azure-storage/azure-storage.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';
import { AdminController } from './admin.controller';
import { UsersModule } from 'src/users/users.module';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteUserHandler } from './commands/delete-user/delete-user.handler';
import { GetUsersHandler } from './queries/get-users/get-users.handler';

@Module({
  imports: [
    CqrsModule,
    AzureStorageModule,
    PaginationModule,
    LoggerModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AdminController],
  providers: [GetUsersHandler, DeleteUserHandler],
})
export class AdminModule {}
