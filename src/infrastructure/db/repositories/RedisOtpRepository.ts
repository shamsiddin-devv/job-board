import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { IOtpRepository } from "src/domain/repositories/IOtpRepository";


@Injectable()
export class RedisOtpRepository implements IOtpRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async create(email: string, code: number): Promise<void> {
    await this.redis.set(`otp:${email}`, code, 'EX', 120, 'NX');
  };

  async find(email: string): Promise<void> {
    await this.redis.get(`otp:${email}`)
  };

  async remove(email: string): Promise<void> {
    await this.redis.del(`otp:${email}`);
  };
};