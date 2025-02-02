import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { PaginationDto, SortOrder } from './pagination.dto';

@Injectable()
export class PaginationService {
  async paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
    alias: string,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const { page, limit, sortBy, order } = paginationDto;
    const offset = (page - 1) * limit;

    if (sortBy) {
      queryBuilder.orderBy(`${alias}.${sortBy}`, order);
    } else {
      queryBuilder.orderBy(`${alias}.id`, SortOrder.DESC);
    }

    const [data, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
