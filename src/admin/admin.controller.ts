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
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(RolesGuard)
@Roles(RoleEnum.USER)
export class AdminController {
  constructor(private readonly userService: UsersService) {}

  @Get('users')
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [User],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
