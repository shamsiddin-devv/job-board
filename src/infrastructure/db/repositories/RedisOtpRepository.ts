import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import type { OtpType } from 'src/domain/entities/OtpCode';
import type { IOtpRepository, OtpResult } from 'src/domain/repositories/IOtpRepository';

const createOtp = `
  if redis.call('EXISTS', KEYS[2]) == 1 then return 0 end
  redis.call('SET', KEYS[1], ARGV[1], 'EX', 300)
  redis.call('DEL', KEYS[3])
  redis.call('SET', KEYS[2], '1', 'EX', 60)
  return 1
`;

const consumeOtp = `
  local code = redis.call('GET', KEYS[1])
  if not code then return 'expired' end
  if code == ARGV[1] then
    redis.call('DEL', KEYS[1], KEYS[2])
    return 'verified'
  end
  local attempts = redis.call('INCR', KEYS[2])
  redis.call('PEXPIRE', KEYS[2], redis.call('PTTL', KEYS[1]))
  if attempts >= 5 then redis.call('DEL', KEYS[1], KEYS[2]) end
  return 'invalid'
`;

@Injectable()
export class RedisOtpRepository implements IOtpRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async create(email: string, purpose: OtpType, code: string): Promise<boolean> {
    const key = this.key(email, purpose);
    return await this.redis.eval(createOtp, 3, key, key + ':cooldown', key + ':attempts', code) === 1;
  }

  async consume(email: string, purpose: OtpType, code: string): Promise<OtpResult> {
    const key = this.key(email, purpose);
    return await this.redis.eval(consumeOtp, 2, key, key + ':attempts', code) as OtpResult;
  }

  private key(email: string, purpose: OtpType): string {
    return `workuz:otp:{${purpose}:${encodeURIComponent(email)}}`;
  }
}
