// utils/redis.ts
import Redis from 'ioredis';
import { config } from '../configs';

const redisClient = new Redis(config.REDIS_URL);

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redisClient;
