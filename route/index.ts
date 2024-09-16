// route/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import { verifyRequestSignature, webhookGet, webhookPost } from '../controllers/facebook';
import { check } from '../controllers/check';

const router = express.Router();

// ใช้ bodyParser พร้อมฟังก์ชัน verifyRequestSignature
router.use(bodyParser.json({ verify: verifyRequestSignature }));

router.get('/webhook', webhookGet);
router.post('/webhook', webhookPost);

// เส้นทางสำหรับ /check
router.get('/check', check);

export default router;
