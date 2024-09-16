"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// utils/redis.ts
const ioredis_1 = __importDefault(require("ioredis"));
const configs_1 = require("../configs");
const redisClient = new ioredis_1.default(configs_1.config.REDIS_URL);
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});
exports.default = redisClient;
