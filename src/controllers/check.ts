// controllers/check.ts
import { Request, Response } from 'express';
import redisClient from '../utils/redis';

export const check = async (req: Request, res: Response) => {
  try {
    const timestamp = Date.now().toString();

    // อ่านค่าจาก Redis ที่ key 'check'
    const value = await redisClient.get('check');

    // แสดงผลค่าที่อ่านได้
    console.log(`Value of key 'check': ${value}`);

    // เขียนค่า current timestamp ไปยัง Redis ที่ key 'check'
    await redisClient.set('check', timestamp);


    res.status(200).json({ message: 'Success', timestamp, value });
  } catch (error: any) {
    console.error('Error in /check:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
