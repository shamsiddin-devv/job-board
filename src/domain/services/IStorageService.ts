export interface IUploadResult {
  url: string;
  publicId: string;
}

export interface IStorageService {
  upload(file: Buffer, folder: string): Promise<IUploadResult>
  delete(publicId: string): Promise<void>
}