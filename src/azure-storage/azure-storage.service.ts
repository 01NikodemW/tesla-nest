import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AzureStorageService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor(private readonly configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      'BLOB_STORAGE_CONNECTION_STRING',
    );
    this.containerName = this.configService.get<string>(
      'BLOB_STORAGE_VEHICLE_IMAGES_CONTAINER_NAME',
    );

    if (!connectionString || !this.containerName) {
      throw new Error('Azure Blob Storage configuration is missing.');
    }

    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    // ✅ Use `Express.Multer.File`
    const blobName = `${uuidv4()}-${file.originalname}`;
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    return blockBlobClient.url; // Return the URL of the uploaded file
  }
}
