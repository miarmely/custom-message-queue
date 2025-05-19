"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const channels = {};
class MiarQueueManagement {
    isChannelExists(channelId) {
        // if "channelId" not found
        if (!(channelId in channels))
            return false;
        return true;
    }
    isQueueExists(channelId, queueName) {
        // if queue is not found on the channel
        if (!(queueName in channels[channelId]))
            return false;
        return true;
    }
    createChannel(req, res) {
        const channelId = crypto_1.default.randomUUID();
        // if "channelId" is conflicted
        if (this.isChannelExists(channelId)) {
            res.json({
                isSuccess: false,
                statusCode: 409,
                data: "Channel is already exists."
            });
            return;
        }
        // create empty channel
        channels[channelId] = {};
        res.json({
            isSuccess: true,
            statusCode: 200,
            data: channelId
        });
    }
    createQueueOnChannel(req, res) {
        var _a, _b;
        const channelId = (_a = req.query.cId) === null || _a === void 0 ? void 0 : _a.toString();
        const queueName = (_b = req.query.qName) === null || _b === void 0 ? void 0 : _b.toString();
        // if parameters is invalid
        if (channelId == undefined
            || queueName == undefined) {
            res.json({
                isSuccess: false,
                statusCode: 400,
                data: "Some parameters is invalid.",
            });
            return;
        }
        // if "channelId" not found
        if (!this.isChannelExists(channelId)) {
            res.json({
                isSuccess: false,
                statusCode: 404,
                data: "Channel not found."
            });
            return;
        }
        // if "queueName" is conflicted
        if (this.isQueueExists(channelId, queueName)) {
            res.json({
                isSuccess: false,
                statusCode: 409,
                data: `Queue with "${queueName}" name is already exists.`
            });
            return;
        }
        // create queue in the channel
        channels[channelId][queueName] = [];
        res.json({
            isSuccess: true,
            statusCode: 200,
            data: queueName
        });
    }
    addMessageToQueue(req, res) {
        var _a, _b, _c;
        const channelId = (_a = req.query.cId) === null || _a === void 0 ? void 0 : _a.toString();
        const queueName = (_b = req.query.qName) === null || _b === void 0 ? void 0 : _b.toString();
        const message = (_c = req.query.msg) === null || _c === void 0 ? void 0 : _c.toString();
        // if parameters is invalid
        if (channelId == undefined
            || queueName == undefined
            || message == undefined) {
            res.json({
                isSuccess: false,
                statusCode: 400,
                data: "Some parameters is invalid.",
            });
            return;
        }
        // if channel not found
        if (!this.isChannelExists(channelId)) {
            res.json({
                isSuccess: false,
                statusCode: 404,
                data: "Channel not found.",
            });
            return;
        }
        // if queue is not found on the channel
        if (!this.isQueueExists(channelId, queueName)) {
            res.json({
                isSuccess: false,
                statusCode: 404,
                data: `Queue with "${queueName}" name not found.`,
            });
            return;
        }
        // add message to the queue on the channel
        channels[channelId][queueName].push(message);
        res.json({
            isSuccess: true,
            data: "Message is added."
        });
    }
    readMessageFromQueue(req, res) {
        var _a, _b;
        const channelId = (_a = req.query.cId) === null || _a === void 0 ? void 0 : _a.toString();
        const queueName = (_b = req.query.qName) === null || _b === void 0 ? void 0 : _b.toString();
        // if parameters is invalid
        if (channelId == undefined
            || queueName == undefined) {
            res.json({
                isSuccess: false,
                statusCode: 400,
                data: "Some parameters is invalid.",
            });
            return;
        }
        // if channel not found
        if (!this.isChannelExists(channelId)) {
            res.json({
                isSuccess: false,
                statusCode: 404,
                data: "Channel not found.",
            });
            return;
        }
        // if queue is not found on the channel
        if (!this.isQueueExists(channelId, queueName)) {
            res.json({
                isSuccess: false,
                statusCode: 404,
                data: `Queue with "${queueName}" name not found.`,
            });
            return;
        }
        // get message and pop
        const message = channels[channelId][queueName].pop();
        res.json({
            isSuccess: true,
            data: {
                message: message != undefined ? message : null,
                leftMessageCount: channels[channelId][queueName].length
            }
        });
    }
}
exports.default = new MiarQueueManagement();
