import { BadRequestException } from '@nestjs/common'
import { memoryStorage } from 'multer'
import { USER_MESSAGES } from 'src/domain/constants/message'

export const multerConfig = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req: any, file: any, cb: any) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowed.includes(file.mimetype)) {
      return cb(new BadRequestException(USER_MESSAGES.FILE_VALIDATION_MESSAGE), false)
    }
    cb(null, true)
  },
}