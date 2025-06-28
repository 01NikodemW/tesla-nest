import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateVehicleDto } from './update-vehicle.dto';

describe('UpdateVehicleDto', () => {
  it('should pass validation if no fields are provided', async () => {
    const dto = {};

    const instance = plainToInstance(UpdateVehicleDto, dto);
    const errors = await validate(instance);

    expect(errors.length).toBe(0);
  });

  it('should pass validation with one field', async () => {
    const dto = { make: 'Tesla' };

    const instance = plainToInstance(UpdateVehicleDto, dto);
    const errors = await validate(instance);

    expect(errors.length).toBe(0);
  });

  it('should fail if a field is invalid type', async () => {
    const dto = { year: 'notANumber' };

    const instance = plainToInstance(UpdateVehicleDto, dto);
    const errors = await validate(instance);

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: 'year' }),
      ])
    );
  });

  it('should fail if a field is out of range', async () => {
    const dto = { year: 1700 };

    const instance = plainToInstance(UpdateVehicleDto, dto);
    const errors = await validate(instance);

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: 'year' }),
      ])
    );
  });

  it('should pass validation with all correct fields', async () => {
    const dto = {
      make: 'Ford',
      model: 'Focus',
      year: 2022,
      rentalPricePerDay: 60,
    };

    const instance = plainToInstance(UpdateVehicleDto, dto);
    const errors = await validate(instance);

    expect(errors.length).toBe(0);
  });
});
