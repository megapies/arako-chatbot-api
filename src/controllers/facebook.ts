// controllers/facebook.ts
import crypto from 'crypto';
import axios from 'axios';
import { Request, Response } from 'express';
import { config } from '../configs';
import { enqueueMessage } from './chatgpt';

export const verifyRequestSignature = (req: Request, res: Response, buf: Buffer) => {
  const signature = req.headers['x-hub-signature-256'] as string;

  if (!signature) {
    console.error('ไม่มีลายเซ็นจาก Facebook');
    res.sendStatus(403);
    throw new Error('ไม่มีลายเซ็นจาก Facebook');
  } else {
    const elements = signature.split('=');
    const method = elements[0];
    const signatureHash = elements[1];

    const expectedHash = crypto.createHmac('sha256', config.APP_SECRET)
      .update(buf)
      .digest('hex');

    if (signatureHash !== expectedHash) {
      console.error('ลายเซ็นไม่ตรงกัน');
      res.sendStatus(403);
      throw new Error('ลายเซ็นไม่ตรงกัน');
    }
  }
};

export const webhookGet = (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === config.VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

export const webhookPost = (req: Request, res: Response) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach((entry: any) => {
      entry.messaging.forEach((webhook_event: any) => {
        const sender_psid = webhook_event.sender.id;
        if (webhook_event.message && webhook_event.message.text) {
          const received_message = webhook_event.message.text;
          enqueueMessage(sender_psid, received_message);
        }
      });
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
};

export const callSendAPI = async (sender_psid: string, response: string) => {
  try {
    await axios.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`, {
      recipient: {
        id: sender_psid,
      },
      message: {
        text: response,
      },
    });
    console.log('ข้อความถูกส่งแล้ว!');
  } catch (error: any) {
    console.error('ไม่สามารถส่งข้อความได้:', error.response ? error.response.data : error.message);
  }
};
