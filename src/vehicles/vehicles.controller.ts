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
import { CreateVehicleImageDto } from './dto/create-vehicle-image.dto';
import { VehicleImage } from './entities/vehicle-image.entity';

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
  @ApiOperation({ summary: 'Retrieve all vehicles with images' })
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
  @ApiOperation({ summary: 'Retrieve a vehicle by ID with its images' })
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
    return this.vehiclesService.delete(id);
  }

  @Post('images')
  @ApiOperation({ summary: 'Add an image to a vehicle' })
  @ApiResponse({
    status: 201,
    description: 'Image added successfully.',
    type: VehicleImage,
  })
  async addImage(@Body() createVehicleImageDto: CreateVehicleImageDto) {
    return this.vehiclesService.addImage(createVehicleImageDto);
  }

  @Delete('images/:id')
  @ApiOperation({ summary: 'Remove an image from a vehicle' })
  @ApiResponse({
    status: 200,
    description: 'Image removed successfully.',
  })
  async removeImage(@Param('id') id: number) {
    return this.vehiclesService.removeImage(id);
  }
}
