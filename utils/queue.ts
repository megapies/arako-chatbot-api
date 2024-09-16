// utils/queue.ts
import Queue from 'bull';
import redisClient from './redis';
import Redis from 'ioredis';
import { config } from '../configs';

export const messageQueue = new Queue('messageQueue', {
  redis: config.REDIS_URL,
});
