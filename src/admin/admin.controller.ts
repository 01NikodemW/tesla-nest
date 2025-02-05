import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../auth/enum/role.enum';
import { User } from 'src/users/entities/user.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUsersQuery } from './queries/get-users/get-users.query';
import { DeleteUserCommand } from './commands/delete-user/delete-user.command';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(RolesGuard)
@Roles(RoleEnum.USER)
export class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('users')
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [User],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.queryBus.execute(new GetUsersQuery(paginationDto));
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async delete(@Param('id') id: number) {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
