// configs/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN || '',
  VERIFY_TOKEN: process.env.VERIFY_TOKEN || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  APP_SECRET: process.env.APP_SECRET || '',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
};
