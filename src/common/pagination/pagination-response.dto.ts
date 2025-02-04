import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  @ApiProperty({ description: 'List of data items', isArray: true })
  data: T[];

  @ApiProperty({ description: 'Total number of items', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  limit: number;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}
