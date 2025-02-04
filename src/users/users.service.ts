import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { LoggerService } from 'src/logger/logger.service';
import { PaginationService } from 'src/common/pagination/pagination.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private loggerService: LoggerService,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    this.loggerService.log(
      `Fetching all vehicles with pagination: ${JSON.stringify(paginationDto)}`,
    );

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    const result = await this.paginationService.paginate(
      queryBuilder,
      paginationDto,
      'user',
    );

    this.loggerService.log(`Fetched ${result.data.length} users`);
    return result;
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(email: string, password: string): Promise<User> {
    const user = this.usersRepository.create({ email, password });
    return this.usersRepository.save(user);
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async delete(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.usersRepository.delete(id);
  }
}
