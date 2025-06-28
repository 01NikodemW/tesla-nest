import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

const mockVehiclesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  uploadImage: jest.fn(),
};

describe('VehiclesController', () => {
  let controller: VehiclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [{ provide: VehiclesService, useValue: mockVehiclesService }],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);

    // Resetujemy mocki po każdym teście
    Object.values(mockVehiclesService).forEach(
      (fn) => fn.mockReset && fn.mockReset(),
    );
  });

  it('should create a vehicle', async () => {
    const dto = {
      make: 'Tesla',
      model: 'Y',
      year: 2024,
      rentalPricePerDay: 120,
    };
    const vehicle = { ...dto, id: 1 };
    mockVehiclesService.create.mockResolvedValue(vehicle);

    const result = await controller.create(dto as any);
    expect(result).toEqual(vehicle);
    expect(mockVehiclesService.create).toHaveBeenCalledWith(dto);
  });

  it('should return all vehicles', async () => {
    const vehicles = [{ id: 1 }, { id: 2 }] as any[];
    mockVehiclesService.findAll.mockResolvedValue(vehicles);

    const result = await controller.findAll({} as any);
    expect(result).toEqual(vehicles);
    expect(mockVehiclesService.findAll).toHaveBeenCalledWith({});
  });

  it('should return a single vehicle by id', async () => {
    const vehicle = { id: 1, make: 'Tesla' };
    mockVehiclesService.findOne.mockResolvedValue(vehicle);

    const result = await controller.findOne(1);
    expect(result).toEqual(vehicle);
    expect(mockVehiclesService.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a vehicle', async () => {
    const dto = { rentalPricePerDay: 150 };
    const updated = { id: 1, make: 'Tesla', rentalPricePerDay: 150 };
    mockVehiclesService.update.mockResolvedValue(updated);

    const result = await controller.update(1, dto as any);
    expect(result).toEqual(updated);
    expect(mockVehiclesService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a vehicle', async () => {
    mockVehiclesService.delete.mockResolvedValue(undefined);
    await controller.remove(1);
    expect(mockVehiclesService.delete).toHaveBeenCalledWith(1);
  });

  it('should upload image for a vehicle', async () => {
    const image = { id: 1, vehicle: { id: 1 }, imageUrl: 'url.jpg' };
    const file = { originalname: 'img.jpg', buffer: Buffer.from('') } as any;
    mockVehiclesService.uploadImage.mockResolvedValue(image);

    const result = await controller.uploadImage(1, file);
    expect(result).toEqual(image);
    expect(mockVehiclesService.uploadImage).toHaveBeenCalledWith(1, file);
  });
});
