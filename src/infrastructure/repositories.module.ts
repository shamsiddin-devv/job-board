import { Global, Module } from "@nestjs/common";
import { PrismaModule } from "./db/prisma.module";
import { PrismaUserRepository } from "./db/repositories/PrismaUserRepository";
import { PrismaApplicationRepository } from "./db/repositories/PrismaApplicationRepository";
import { PrismaCompanyRepository } from "./db/repositories/PrismaCompanyRepository";
import { PrismaJobRepository } from "./db/repositories/PrismaJobRepository";
import { PrismaNotificationRepository } from "./db/repositories/PrismaNotificationRepository";
import { RedisOtpRepository } from "./db/repositories/RedisOtpRepository";
import { PrismaRefreshTokenRepository } from "./db/repositories/PrismaRefreshTokenRepository";
import { PrismaSavedJobRepository } from "./db/repositories/PrismaSavedJobRepository";
import { PrismaResumeRepository } from "./db/repositories/PrismaResumeRepository";
import { CacheRedisService } from "./redis/redis.service";
import { NodemailerService } from "./email/Nodemailer";
import { BcryptHash } from "./auth/BcryptHash";
import { CloudinaryService } from "./storage/cloudinary.service";
import { JsonWebToken } from "./auth/Jwt";


@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    {provide: 'IUserRepository', useClass: PrismaUserRepository},
    {provide: 'IApplicationRepository', useClass: PrismaApplicationRepository},
    {provide: 'ICompanyRepository', useClass: PrismaCompanyRepository},
    {provide: 'IJobRepository', useClass: PrismaJobRepository},
    {provide: 'INotificationRepository', useClass: PrismaNotificationRepository},
    {provide: 'IResumeRepository', useClass: PrismaResumeRepository},
    {provide: 'ISavedJobRepository', useClass: PrismaSavedJobRepository},
    {provide: 'IOtpRepository', useClass: RedisOtpRepository},
    {provide: 'IRefreshTokenRepository', useClass: PrismaRefreshTokenRepository},
    {provide: 'ICacheRedisService', useClass: CacheRedisService},
    {provide: 'INodeMailerService', useClass: NodemailerService},
    {provide: 'IHashService', useClass: BcryptHash},
    {provide: 'IStorageService', useClass: CloudinaryService},
    {provide: 'ITokenService', useClass: JsonWebToken},
  ],
  exports: [
    'IUserRepository', 'IJobRepository', 'ICompanyRepository',
    'IApplicationRepository', 'INotificationRepository', 'IResumeRepository',
    'ISavedJobRepository', 'IRefreshTokenRepository', 'IOtpRepository',
    'ICacheRedisService', 'IHashService', 'ITokenService', 'INodeMailerService',
    'IStorageService',
  ]
})
export class RepositoriesModule {};