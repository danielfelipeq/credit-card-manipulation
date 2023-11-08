import { Injectable } from '@nestjs/common';
import { RedisService as NestRedisService } from 'nestjs-redis';

@Injectable()
export class RedisService {
  constructor(private readonly nestRedisService: NestRedisService) {}

  async set(key: string, value: string): Promise<void> {
    const client = this.nestRedisService.getClient();
    await client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    const client = this.nestRedisService.getClient();
    return await client.get(key);
  }
}
