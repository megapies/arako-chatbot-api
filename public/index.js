"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const express_1 = __importDefault(require("express"));
const route_1 = __importDefault(require("./route"));
const app = (0, express_1.default)();
app.use('/', route_1.default);
app.get('/', (req, res) => {
    return res.json({ status: 'OK' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SERVER START AT PORT: ${PORT}`);
});
