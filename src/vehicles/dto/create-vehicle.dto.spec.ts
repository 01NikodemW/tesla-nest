import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateVehicleDto } from './create-vehicle.dto';

describe('CreateVehicleDto', () => {
  it('should pass validation with correct data', async () => {
    const dto = {
      make: 'Toyota',
      model: 'Corolla',
      year: 2022,
      rentalPricePerDay: 100,
    };

    const instance = plainToInstance(CreateVehicleDto, dto);
    const errors = await validate(instance);

    expect(errors.length).toBe(0);
  });

  it('should fail if make is missing', async () => {
    const dto = {
      model: 'Corolla',
      year: 2022,
      rentalPricePerDay: 100,
    };

    const instance = plainToInstance(CreateVehicleDto, dto);
    const errors = await validate(instance);

    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ property: 'make' })]),
    );
  });

  it('should fail if year is not integer', async () => {
    const dto = {
      make: 'Toyota',
      model: 'Corolla',
      year: 'abcd', // invalid
      rentalPricePerDay: 100,
    };

    const instance = plainToInstance(CreateVehicleDto, dto);
    const errors = await validate(instance);

    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ property: 'year' })]),
    );
  });

  it('should fail if year is out of range', async () => {
    const dto = {
      make: 'Toyota',
      model: 'Corolla',
      year: 1850, // too old
      rentalPricePerDay: 100,
    };

    const instance = plainToInstance(CreateVehicleDto, dto);
    const errors = await validate(instance);

    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ property: 'year' })]),
    );
  });

  it('should fail if rentalPricePerDay is below minimum', async () => {
    const dto = {
      make: 'Toyota',
      model: 'Corolla',
      year: 2022,
      rentalPricePerDay: 0,
    };

    const instance = plainToInstance(CreateVehicleDto, dto);
    const errors = await validate(instance);

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: 'rentalPricePerDay' }),
      ]),
    );
  });
});
