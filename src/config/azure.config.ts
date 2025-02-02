import { registerAs } from '@nestjs/config';

export default registerAs('azure', () => ({
  blobStorageConnectionString: process.env.BLOB_STORAGE_CONNECTION_STRING,
  blobStorageVehicleImagesContainerName:
    process.env.BLOB_STORAGE_VEHICLE_IMAGES_CONTAINER_NAME,
}));
