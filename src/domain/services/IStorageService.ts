export interface IUploadResult {
  url: string;
  publicId: string;
}

export interface IStorageRepository {
  upload(file: Buffer, folder: string): Promise<IUploadResult>
  delete(publicId: string): Promise<void>
}