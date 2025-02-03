import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../auth/enum/role.enum';

@ApiTags('Vehicles')
@Controller('vehicles')
@UseGuards(RolesGuard)
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
  @Roles(RoleEnum.USER)
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.vehiclesService.findAll(paginationDto);
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

  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data') // ✅ Specify form-data content type
  @ApiOperation({ summary: 'Upload an image for a vehicle' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // ✅ Needed to show file upload field in Swagger
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully.' })
  async uploadImage(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.vehiclesService.uploadImage(id, file);
  }
}
