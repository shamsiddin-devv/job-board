import { ConfigService } from "@nestjs/config";
import {v2 as cloudinary} from "cloudinary";
import { IStorageRepository, IUploadResult } from "src/domain/services/IStorageRepository";

export class StorageCloudinary implements IStorageRepository {
  private readonly configService = new ConfigService();
  private readonly cloudinaryConfig = cloudinary.config({
    cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
    api_key: this.configService.get('CLOUDINARY_API_KEY'),
    api_secret: this.configService.get('CLOUDINARY_SECRET')
  });

  async upload(file: Buffer, folder: string): Promise<IUploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {folder, resource_type: 'auto'},
        (error, result) => {
          if(error || !result) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          })
        }
      )
      stream.end(file)
    })
  }
  
  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId)
  }
}