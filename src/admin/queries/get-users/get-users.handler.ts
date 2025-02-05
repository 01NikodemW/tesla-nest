import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from './get-users.query';
import { UsersService } from 'src/users/users.service';
import { PaginatedResponse } from 'src/common/pagination/pagination-response.dto';
import { User } from 'src/users/entities/user.entity';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly usersService: UsersService) {}

  async execute(query: GetUsersQuery): Promise<PaginatedResponse<User>> {
    return this.usersService.findAll(query.paginationDto);
  }
}
