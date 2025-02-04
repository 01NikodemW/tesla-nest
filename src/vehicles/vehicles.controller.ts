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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateVehicleCommand } from './commands/create-vehicle/create-vehicle.command';
import { GetVehicleByIdQuery } from './queries/get-vehicle-by-id/get-vehicle-by-id.query';
import { DeleteVehicleCommand } from './commands/delete-vehicle/delete-vehicle.command';
import { UpdateVehicleCommand } from './commands/update-vehicle/update-vehicle.command';
import { UploadVehicleImageCommand } from './commands/upload-vehicle-image/upload-vehicle-image.command';
import { GetVehiclesQuery } from './queries/get-vehicles/get-vehicles.query';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all vehicles with images' })
  @ApiResponse({
    status: 200,
    description: 'List of vehicles retrieved.',
    type: [Vehicle],
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.queryBus.execute(new GetVehiclesQuery(paginationDto));
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
    return this.queryBus.execute(new GetVehicleByIdQuery(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({
    status: 201,
    description: 'Vehicle created successfully.',
    type: Vehicle,
  })
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.commandBus.execute(new CreateVehicleCommand(createVehicleDto));
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
    return this.commandBus.execute(
      new UpdateVehicleCommand(id, updateVehicleDto),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a vehicle by ID' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle removed successfully.',
  })
  async remove(@Param('id') id: number) {
    return this.commandBus.execute(new DeleteVehicleCommand(id));
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
    return this.commandBus.execute(new UploadVehicleImageCommand(id, file));
  }
}
