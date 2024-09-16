// controllers/chatgpt.ts
import { messageQueue } from '../utils/queue';
import { callSendAPI } from './facebook';
import { config } from '../configs';
import axios from 'axios';
import redisClient from '../utils/redis';

export const enqueueMessage = (sender_psid: string, message: string) => {
  messageQueue.add({ sender_psid, message });
};

messageQueue.process(async (job) => {
  const { sender_psid, message } = job.data;
  await handleMessage(sender_psid, message);
});

const handleMessage = async (sender_psid: string, received_message: string) => {
  try {
    // ดึงข้อมูลการสนทนาของผู้ใช้จาก Redis
    const conversationData = await redisClient.get(`conversation:${sender_psid}`);
    let userConversations = conversationData ? JSON.parse(conversationData) : [];

    // เพิ่มข้อความของผู้ใช้ลงในประวัติการสนทนา
    userConversations.push({ role: 'user', content: received_message });

    // ส่งประวัติการสนทนาไปยัง OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // ระบุโมเดลที่คุณปรับแต่ง
        messages: userConversations,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.OPENAI_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    // เพิ่มการตอบกลับของบอทลงในประวัติการสนทนา
    userConversations.push({ role: 'assistant', content: reply });

    // บันทึกข้อมูลการสนทนาที่อัปเดตกลับไปยัง Redis
    await redisClient.set(
      `conversation:${sender_psid}`,
      JSON.stringify(userConversations),
      'EX',
      60 * 60 * 24 * 15,
    );

    // ส่งการตอบกลับไปยังผู้ใช้
    await callSendAPI(sender_psid, reply);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response ? error.response.data : error.message);
    } else if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    await callSendAPI(sender_psid, 'ขออภัย เกิดข้อผิดพลาดในการประมวลผลข้อความของคุณ');
  }
};
