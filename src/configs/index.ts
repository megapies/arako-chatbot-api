// configs/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN || '',
  VERIFY_TOKEN: process.env.VERIFY_TOKEN || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  APP_SECRET: process.env.APP_SECRET || '',
  REDIS_URL: process.env.REDIS_URL || '',
};
