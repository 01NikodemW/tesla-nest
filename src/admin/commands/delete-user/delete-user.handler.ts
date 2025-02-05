import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { UsersService } from 'src/users/users.service';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly usersService: UsersService) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    return this.usersService.delete(command.id);
  }
}
