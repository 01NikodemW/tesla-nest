import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateReservationCommand } from './commands/create-reservation/create-reservation.command';
import { GetReservationsQuery } from './queries/get-reservations/get-reservations.query';
import { GetReservationByIdQuery } from './queries/get-reservation-by-id/get-reservation-by-id.query';
import { UpdateReservationCommand } from './commands/update-reservation/update-reservation.command';
import { DeleteReservationCommand } from './commands/delete-reservation/delete-reservation.command';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all reservations with pagination & sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'List of paginated reservations retrieved.',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.queryBus.execute(new GetReservationsQuery(paginationDto));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a reservation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Reservation retrieved successfully.',
  })
  async findOne(@Param('id') id: number) {
    return this.queryBus.execute(new GetReservationByIdQuery(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({
    status: 201,
    description: 'Reservation created successfully.',
  })
  async create(@Body() createReservationDto: CreateReservationDto) {
    return this.commandBus.execute(
      new CreateReservationCommand(createReservationDto),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reservation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Reservation updated successfully.',
  })
  async update(
    @Param('id') id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.commandBus.execute(
      new UpdateReservationCommand(id, updateReservationDto),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reservation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Reservation deleted successfully.',
  })
  async remove(@Param('id') id: number) {
    return this.commandBus.execute(new DeleteReservationCommand(id));
  }
}
