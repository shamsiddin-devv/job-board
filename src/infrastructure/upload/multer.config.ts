import { BadRequestException } from '@nestjs/common'
import { memoryStorage } from 'multer'
import { USER_MESSAGES } from 'src/domain/constants/message'

export function hasAllowedFileSignature(file: Express.Multer.File, kind: 'application/pdf' | 'image'): boolean {
  const { mimetype, buffer } = file;
  if (kind === 'application/pdf') {
    return mimetype === 'application/pdf' && buffer.subarray(0, 5).toString('ascii') === '%PDF-';
  }
  if (mimetype === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
  return mimetype === 'image/jpeg' && buffer.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex'));
}

export const multerConfig = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0 }, // 5 MB
  fileFilter: (req: any, file: any, cb: any) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowed.includes(file.mimetype)) {
      return cb(new BadRequestException(USER_MESSAGES.FILE_VALIDATION_MESSAGE), false)
    }
    cb(null, true)
  },
}