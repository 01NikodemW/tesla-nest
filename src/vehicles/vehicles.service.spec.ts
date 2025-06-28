import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleImage } from './entities/vehicle-image.entity';
import { AzureStorageService } from '../azure-storage/azure-storage.service';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { LoggerService } from 'src/logger/logger.service';

const mockVehicleRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
};
const mockVehicleImageRepo = {
  create: jest.fn(),
  save: jest.fn(),
};
const mockAzureStorageService = { uploadFile: jest.fn() };
const mockPaginationService = { paginate: jest.fn() };
const mockLoggerService = { log: jest.fn(), warn: jest.fn() };

describe('VehiclesService', () => {
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        { provide: getRepositoryToken(Vehicle), useValue: mockVehicleRepo },
        {
          provide: getRepositoryToken(VehicleImage),
          useValue: mockVehicleImageRepo,
        },
        { provide: AzureStorageService, useValue: mockAzureStorageService },
        { provide: PaginationService, useValue: mockPaginationService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);

    // Reset mocks for isolation between tests
    Object.values(mockVehicleRepo).forEach(
      (fn) => fn.mockReset && fn.mockReset(),
    );
    Object.values(mockVehicleImageRepo).forEach(
      (fn) => fn.mockReset && fn.mockReset(),
    );
    mockAzureStorageService.uploadFile.mockReset();
    mockPaginationService.paginate.mockReset();
    mockLoggerService.log.mockReset();
    mockLoggerService.warn.mockReset();
  });

  it('should create a vehicle', async () => {
    const dto = {
      make: 'Tesla',
      model: 'X',
      year: 2020,
      rentalPricePerDay: 100,
    };
    const entity = { ...dto, id: 1 };
    mockVehicleRepo.create.mockReturnValue(dto);
    mockVehicleRepo.save.mockResolvedValue(entity);

    const result = await service.create(dto as any);
    expect(result).toEqual(entity);
    expect(mockVehicleRepo.create).toBeCalledWith(dto);
    expect(mockVehicleRepo.save).toBeCalledWith(dto);
  });

  it('should get a vehicle by id', async () => {
    const vehicle = { id: 1, make: 'Tesla', images: [] };
    mockVehicleRepo.findOne.mockResolvedValue(vehicle);

    const result = await service.findOne(1);
    expect(result).toBe(vehicle);
    expect(mockVehicleRepo.findOne).toBeCalledWith({
      where: { id: 1 },
      relations: ['images'],
    });
  });

  it('should throw NotFoundException if vehicle not found', async () => {
    mockVehicleRepo.findOne.mockResolvedValue(undefined);
    await expect(service.findOne(999)).rejects.toThrow(
      'Vehicle with ID 999 not found',
    );
  });

  it('should update a vehicle', async () => {
    const vehicle = {
      id: 1,
      make: 'Tesla',
      model: 'X',
      year: 2020,
      rentalPricePerDay: 100,
    };
    mockVehicleRepo.findOne.mockResolvedValue(vehicle);
    mockVehicleRepo.save.mockResolvedValue({
      ...vehicle,
      rentalPricePerDay: 120,
    });

    const result = await service.update(1, { rentalPricePerDay: 120 } as any);
    expect(result.rentalPricePerDay).toBe(120);
  });

  it('should throw NotFoundException when updating non-existing vehicle', async () => {
    mockVehicleRepo.findOne.mockResolvedValue(undefined);

    await expect(service.update(999, { make: 'Nowa' } as any)).rejects.toThrow(
      'Vehicle with ID 999 not found',
    );
  });

  it('should delete a vehicle', async () => {
    const vehicle = { id: 1, make: 'Tesla' };
    mockVehicleRepo.findOne.mockResolvedValue(vehicle);
    mockVehicleRepo.remove.mockResolvedValue(undefined);

    await service.delete(1);
    expect(mockVehicleRepo.remove).toBeCalledWith(vehicle);
  });

  it('should throw NotFoundException when deleting non-existing vehicle', async () => {
    mockVehicleRepo.findOne.mockResolvedValue(undefined);

    await expect(service.delete(999)).rejects.toThrow(
      'Vehicle with ID 999 not found',
    );
  });

  it('should upload image for a vehicle', async () => {
    const file = {
      originalname: 'img.jpg',
      buffer: Buffer.from(''),
      mimetype: 'image/jpeg',
    } as any;
    const vehicle = { id: 1, images: [] };
    mockVehicleRepo.findOne.mockResolvedValue(vehicle);
    mockAzureStorageService.uploadFile.mockResolvedValue('url.jpg');
    const image = { id: 1, vehicle, imageUrl: 'url.jpg' };
    mockVehicleImageRepo.create.mockReturnValue({
      vehicle,
      imageUrl: 'url.jpg',
    });
    mockVehicleImageRepo.save.mockResolvedValue(image);

    const result = await service.uploadImage(1, file);
    expect(result).toEqual(image);
    expect(mockAzureStorageService.uploadFile).toBeCalledWith(file);
    expect(mockVehicleImageRepo.create).toBeCalledWith({
      vehicle,
      imageUrl: 'url.jpg',
    });
    expect(mockVehicleImageRepo.save).toBeCalled();
  });

  it('should throw NotFoundException when uploading image for non-existing vehicle', async () => {
    mockVehicleRepo.findOne.mockResolvedValue(undefined);

    await expect(service.uploadImage(123, {} as any)).rejects.toThrow(
      /Vehicle with ID 123 not found/,
    );
  });

  it('should fetch all vehicles with pagination', async () => {
    const paginationDto = { page: 1, limit: 10 } as any;
    const paginatedResult = {
      data: [
        {
          id: 1,
          make: 'Tesla',
          model: 'S',
          year: 2020,
          rentalPricePerDay: 100,
          images: [],
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    };
    // Udajemy, że queryBuilder zwraca się poprawnie, a paginate woła paginatedResult
    mockVehicleRepo.createQueryBuilder.mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest
        .fn()
        .mockResolvedValue([paginatedResult.data, paginatedResult.total]),
      orderBy: jest.fn().mockReturnThis(),
    });
    mockPaginationService.paginate.mockResolvedValue(paginatedResult);

    const result = await service.findAll(paginationDto);
    expect(result).toEqual(paginatedResult);
    expect(mockPaginationService.paginate).toBeCalled();
  });

  it('should call loggerService.log when creating vehicle', async () => {
    const dto = {
      make: 'BMW',
      model: 'M3',
      year: 2021,
      rentalPricePerDay: 200,
    };
    mockVehicleRepo.create.mockReturnValue(dto);
    mockVehicleRepo.save.mockResolvedValue({ ...dto, id: 2 });

    await service.create(dto as any);
    expect(mockLoggerService.log).toHaveBeenCalled();
  });
});
