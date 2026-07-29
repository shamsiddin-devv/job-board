import { Module } from "@nestjs/common";
import {RedisModule as IoRedisModule} from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RepositoriesModule } from "../repositories.module";
import { CacheRedisService } from "./redis.service";

@Module({
  imports: [
    IoRedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: config.get('REDIS_URL')
      })
    }),
    RepositoriesModule
  ],
  providers: [CacheRedisService],
  exports: [CacheRedisService]
})
export class RedisModule {}