"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callSendAPI = exports.webhookPost = exports.webhookGet = exports.verifyRequestSignature = void 0;
// controllers/facebook.ts
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const configs_1 = require("../configs");
const chatgpt_1 = require("./chatgpt");
const verifyRequestSignature = (req, res, buf) => {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        console.error('ไม่มีลายเซ็นจาก Facebook');
        res.sendStatus(403);
        throw new Error('ไม่มีลายเซ็นจาก Facebook');
    }
    else {
        const elements = signature.split('=');
        const method = elements[0];
        const signatureHash = elements[1];
        const expectedHash = crypto_1.default.createHmac('sha256', configs_1.config.APP_SECRET)
            .update(buf)
            .digest('hex');
        if (signatureHash !== expectedHash) {
            console.error('ลายเซ็นไม่ตรงกัน');
            res.sendStatus(403);
            throw new Error('ลายเซ็นไม่ตรงกัน');
        }
    }
};
exports.verifyRequestSignature = verifyRequestSignature;
const webhookGet = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode && token) {
        if (mode === 'subscribe' && token === configs_1.config.VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        }
        else {
            res.sendStatus(403);
        }
    }
};
exports.webhookGet = webhookGet;
const webhookPost = (req, res) => {
    const body = req.body;
    if (body.object === 'page') {
        body.entry.forEach((entry) => {
            entry.messaging.forEach((webhook_event) => {
                const sender_psid = webhook_event.sender.id;
                if (webhook_event.message && webhook_event.message.text) {
                    const received_message = webhook_event.message.text;
                    (0, chatgpt_1.enqueueMessage)(sender_psid, received_message);
                }
            });
        });
        res.status(200).send('EVENT_RECEIVED');
    }
    else {
        res.sendStatus(404);
    }
};
exports.webhookPost = webhookPost;
const callSendAPI = async (sender_psid, response) => {
    try {
        await axios_1.default.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${configs_1.config.PAGE_ACCESS_TOKEN}`, {
            recipient: {
                id: sender_psid,
            },
            message: {
                text: response,
            },
        });
        console.log('ข้อความถูกส่งแล้ว!');
    }
    catch (error) {
        console.error('ไม่สามารถส่งข้อความได้:', error.response ? error.response.data : error.message);
    }
};
exports.callSendAPI = callSendAPI;
