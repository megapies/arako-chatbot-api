"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageQueue = void 0;
// utils/queue.ts
const bull_1 = __importDefault(require("bull"));
const configs_1 = require("../configs");
exports.messageQueue = new bull_1.default('messageQueue', {
    redis: configs_1.config.REDIS_URL,
});
