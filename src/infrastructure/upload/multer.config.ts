import { BadRequestException } from '@nestjs/common'
import { memoryStorage } from 'multer'

export const multerConfig = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req: any, file: any, cb: any) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowed.includes(file.mimetype)) {
      return cb(new BadRequestException('Faqat PDF, JPG, PNG qabul qilinadi'), false)
    }
    cb(null, true)
  },
}