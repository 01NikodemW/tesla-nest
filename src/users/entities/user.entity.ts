import { Entity, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { RoleEnum } from 'src/auth/enum/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @ApiProperty({
    description: 'Email address of the user',
    example: 'email@gmail.com',
  })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column('text', { array: true, default: [RoleEnum.USER] })
  @ApiProperty({
    description: 'List of user roles',
    example: [RoleEnum.USER],
  })
  roles: RoleEnum[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
