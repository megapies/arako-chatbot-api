"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
const redis_1 = __importDefault(require("../utils/redis"));
const check = async (req, res) => {
    try {
        const timestamp = Date.now().toString();
        // อ่านค่าจาก Redis ที่ key 'check'
        const value = await redis_1.default.get('check');
        // แสดงผลค่าที่อ่านได้
        console.log(`Value of key 'check': ${value}`);
        // เขียนค่า current timestamp ไปยัง Redis ที่ key 'check'
        await redis_1.default.set('check', timestamp);
        res.status(200).json({ message: 'Success', timestamp, value });
    }
    catch (error) {
        console.error('Error in /check:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.check = check;
