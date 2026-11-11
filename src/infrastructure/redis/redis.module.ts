import { Module } from "@nestjs/common";
import {RedisModule as IoRedisModule} from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheRedisService } from "./redis.service";

@Module({
  imports: [
    IoRedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: config.getOrThrow<string>('REDIS_URL'),
        options: { connectTimeout: 2000, commandTimeout: 3000, maxRetriesPerRequest: 1 }
      })
    }),
  ],
  providers: [CacheRedisService],
  exports: [CacheRedisService]
})
export class RedisModule {}