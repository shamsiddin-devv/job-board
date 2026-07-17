import { Module } from "@nestjs/common";
import {RedisModule as IoRedisModule} from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    IoRedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: config.get('REDIS_URL')
      })
    })
  ],
  exports: [IoRedisModule]
})
export class RedisModule {}