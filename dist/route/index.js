"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// route/index.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const facebook_1 = require("../controllers/facebook");
const check_1 = require("../controllers/check");
const router = express_1.default.Router();
// ใช้ bodyParser พร้อมฟังก์ชัน verifyRequestSignature
router.use(body_parser_1.default.json({ verify: facebook_1.verifyRequestSignature }));
router.get('/webhook', facebook_1.webhookGet);
router.post('/webhook', facebook_1.webhookPost);
// เส้นทางสำหรับ /check
router.get('/check', check_1.check);
exports.default = router;
