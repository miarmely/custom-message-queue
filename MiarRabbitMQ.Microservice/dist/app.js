"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const miar_queue_management_1 = __importDefault(require("./miar-queue-management"));
const PORT = 3000;
const app = (0, express_1.default)();
app.get("/channel/add", (req, res) => miar_queue_management_1.default.createChannel(req, res));
app.get("/queue/add", (req, res) => miar_queue_management_1.default.createQueueOnChannel(req, res));
app.get("/message/add", (req, res) => miar_queue_management_1.default.addMessageToQueue(req, res));
app.get("/message/read", (req, res) => miar_queue_management_1.default.readMessageFromQueue(req, res));
app.listen(PORT, () => {
    console.log(`Miar_RabbitMQ server is started at "${PORT}" port.`);
});
