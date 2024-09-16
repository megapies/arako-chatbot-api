"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// configs/index.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN || '',
    VERIFY_TOKEN: process.env.VERIFY_TOKEN || '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    APP_SECRET: process.env.APP_SECRET || '',
    REDIS_URL: process.env.REDIS_URL || '',
};
