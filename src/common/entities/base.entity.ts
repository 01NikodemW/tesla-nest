import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  id: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'Timestamp when entity was created',
    example: '2025-02-02T20:00:00.000Z',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: 'Timestamp when entity was last updated',
    example: '2025-02-02T21:00:00.000Z',
  })
  updatedAt: Date;
}
