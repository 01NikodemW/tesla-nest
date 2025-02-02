import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({
    status: 201,
    description: 'Vehicle created successfully.',
    type: Vehicle,
  })
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all vehicles' })
  @ApiResponse({
    status: 200,
    description: 'List of vehicles retrieved.',
    type: [Vehicle],
  })
  async findAll() {
    return this.vehiclesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a vehicle by ID' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle retrieved successfully.',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  async findOne(@Param('id') id: number) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle by ID' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle updated successfully.',
    type: Vehicle,
  })
  async update(
    @Param('id') id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a vehicle by ID' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle removed successfully.',
  })
  async remove(@Param('id') id: number) {
    return this.vehiclesService.remove(id);
  }
}
