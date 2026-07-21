import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { ICacheRedisInterface } from "src/domain/services/ICacheRedisService";

export class CacheRedisService implements ICacheRedisInterface {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if(!data) return null;
    return JSON.parse(data) as T;
  };

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const data = JSON.stringify(value);
    await this.redis.set(key, data, 'EX', ttlSeconds);
  };

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  };

  async deleteByPattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if(keys.length > 0) {
      await this.redis.del(...keys);
    };
  };
};