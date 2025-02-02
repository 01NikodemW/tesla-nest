import { Injectable, BadRequestException } from '@nestjs/common';
import { SelectQueryBuilder, DataSource } from 'typeorm';
import { PaginationDto, SortOrder } from './pagination.dto';

@Injectable()
export class PaginationService {
  constructor(private readonly dataSource: DataSource) {} // ✅ Inject DataSource

  async paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
    alias: string,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const { page, limit, sortBy, order } = paginationDto;
    const offset = (page - 1) * limit;

    // ✅ Get metadata and filter out relations (objects)
    const metadata = this.dataSource.getMetadata(queryBuilder.alias);
    const validColumns = metadata.columns
      .filter((col) => !col.relationMetadata) // ✅ Exclude object relations
      .map((col) => col.propertyName);

    // ✅ Validate `sortBy`
    if (sortBy && !validColumns.includes(sortBy)) {
      throw new BadRequestException(
        `Invalid sort field: "${sortBy}". Allowed fields: ${validColumns.join(', ')}`,
      );
    }

    // ✅ Apply sorting dynamically
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
