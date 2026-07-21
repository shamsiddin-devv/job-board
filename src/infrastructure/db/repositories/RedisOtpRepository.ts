import { Injectable } from "@nestjs/common";
import { IOtpRepository } from "src/domain/repositories/IOtpRepository";
import { CacheRedisService } from "src/infrastructure/redis/redis.service";

@Injectable()
export class RedisOtpRepository implements IOtpRepository {
  constructor(private readonly cacheService: CacheRedisService) {}

  async create(email: string, code: string): Promise<void> {
    await this.cacheService.set(`otp:${email}`, code, 120);
  };

  async find(email: string): Promise<string | null> {
    return this.cacheService.get(`otp:${email}`)
  };

  async remove(email: string): Promise<void> {
    await this.cacheService.delete(`otp:${email}`);
  };
};