import { Inject, Injectable } from '@nestjs/common';
import { IOtpRepository } from 'src/domain/repositories/IOtpRepository';
import type { ICacheRedisService } from 'src/domain/services/ICacheRedisService';

@Injectable()
export class RedisOtpRepository implements IOtpRepository {
  constructor(
    @Inject('ICacheRedisService')
    private readonly redisService: ICacheRedisService,
  ) {}

  async create(email: string, code: string): Promise<void> {
    await this.redisService.set(`otp:${email}`, code, 120);
  }

  async find(email: string): Promise<string | null> {
    return this.redisService.get(`otp:${email}`);
  }

  async delete(email: string): Promise<void> {
    await this.redisService.delete(`otp:${email}`);
  }
}
