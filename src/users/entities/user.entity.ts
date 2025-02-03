import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { RoleEnum } from 'src/auth/enum/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column('text', { array: true, default: [RoleEnum.USER] }) 
  roles: RoleEnum[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
