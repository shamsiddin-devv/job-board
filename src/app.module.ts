import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/db/prisma.module';
import { RedisModule } from './infrastructure/redis/redis.module';
  
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    })
  ],
  controllers: [],
  providers: [
    PrismaModule,
    RedisModule,
  ],
})
export class AppModule {}
