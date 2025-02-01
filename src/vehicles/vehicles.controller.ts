import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  // Create a new vehicle
  @Post()
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  // Retrieve all vehicles
  @Get()
  async findAll() {
    return this.vehiclesService.findAll();
  }

  // Retrieve a single vehicle by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.vehiclesService.findOne(id); // Remove the `+` to avoid coercion if `id` is a string
  }

  // Update a vehicle by ID
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  // Remove a vehicle by ID
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.vehiclesService.remove(id);
  }
}
