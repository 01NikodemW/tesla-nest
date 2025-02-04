import { DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Exclude } from 'class-transformer';

export abstract class BaseEntitySoftDelete extends BaseEntity {
  @DeleteDateColumn({ nullable: true })
  @ApiProperty({
    description: 'Timestamp when entity was soft deleted',
    example: '2025-02-10T15:00:00.000Z',
  })
  @Exclude()
  deletedAt?: Date | null;
}
