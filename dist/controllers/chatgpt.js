"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueueMessage = void 0;
// controllers/chatgpt.ts
const queue_1 = require("../utils/queue");
const facebook_1 = require("./facebook");
const configs_1 = require("../configs");
const axios_1 = __importDefault(require("axios"));
const redis_1 = __importDefault(require("../utils/redis"));
const enqueueMessage = (sender_psid, message) => {
    queue_1.messageQueue.add({ sender_psid, message });
};
exports.enqueueMessage = enqueueMessage;
queue_1.messageQueue.process(async (job) => {
    const { sender_psid, message } = job.data;
    await handleMessage(sender_psid, message);
});
const handleMessage = async (sender_psid, received_message) => {
    try {
        // ดึงข้อมูลการสนทนาของผู้ใช้จาก Redis
        const conversationData = await redis_1.default.get(`conversation:${sender_psid}`);
        let userConversations = conversationData ? JSON.parse(conversationData) : [];
        // เพิ่มข้อความของผู้ใช้ลงในประวัติการสนทนา
        userConversations.push({ role: 'user', content: received_message });
        // ส่งประวัติการสนทนาไปยัง OpenAI API
        const response = await axios_1.default.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo', // ระบุโมเดลที่คุณปรับแต่ง
            messages: userConversations,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${configs_1.config.OPENAI_API_KEY}`,
            },
        });
        const reply = response.data.choices[0].message.content;
        // เพิ่มการตอบกลับของบอทลงในประวัติการสนทนา
        userConversations.push({ role: 'assistant', content: reply });
        // บันทึกข้อมูลการสนทนาที่อัปเดตกลับไปยัง Redis
        await redis_1.default.set(`conversation:${sender_psid}`, JSON.stringify(userConversations), 'EX', 60 * 60 * 24 * 15);
        // ส่งการตอบกลับไปยังผู้ใช้
        await (0, facebook_1.callSendAPI)(sender_psid, reply);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Axios error:', error.response ? error.response.data : error.message);
        }
        else if (error instanceof Error) {
            console.error('Error:', error.message);
        }
        else {
            console.error('Unexpected error:', error);
        }
        await (0, facebook_1.callSendAPI)(sender_psid, 'ขออภัย เกิดข้อผิดพลาดในการประมวลผลข้อความของคุณ');
    }
};
