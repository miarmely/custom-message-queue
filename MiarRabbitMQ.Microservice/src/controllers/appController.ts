import { Request, Response } from "express";
import crypto from "crypto"

const channels: {
    [channelId: string]: {
        [queueName: string]: {
            messages: string[],
            ackCount: 0,
            nackCount: 0,
            isConsuming: boolean,  // for check whether "critical section"
        }
    }
} = {};

class AppController {
    setJsonResponse(isSuccess: boolean, statusCode: number, data: any, res: Response) {
        res.json({
            isSuccess,
            statusCode,
            data
        });
    }
    isChannelExists(channelId: string) {
        // if "channelId" not found
        if (!(channelId in channels)) return false;

        return true;
    }
    isQueueExists(channelId: string, queueName: string) {
        // if queue is not found on the channel
        if (!(queueName in channels[channelId])) return false;

        return true;
    }
    sendAck(req: Request, res: Response) {
        //#region check parameters
        const channelId: string | undefined = req.query.cId?.toString();
        const queueName: string | undefined = req.query.qName?.toString();

        // if parameters is invalid
        if (channelId == undefined
            || queueName == undefined) {
            this.setJsonResponse(false, 400, "Some parameters is invalid.", res);
            return;
        }

        // if "channelId" not found
        if (!this.isChannelExists(channelId)) {
            this.setJsonResponse(false, 404, "Channel not found.", res);
            return;
        }

        // if "queueName" not found
        if (!this.isQueueExists(channelId, queueName)) {
            this.setJsonResponse(false, 404, `Queue with "${queueName}" name not found.`, res);
            return;
        }
        //#endregion

        //#region pre-check before handle
        // if queue is not consuming
        const queue = channels[channelId][queueName];
        if (!queue.isConsuming) {
            this.setJsonResponse(false, 400, `Queue with "${queueName}" name is not consuming. You can't send ACK to queue which not consuming.`, res);
            return;
        }
        //#endregion

        //#region handle ack
        queue.messages.splice(0, 1);  // by FIFO
        queue.ackCount += 1;
        queue.isConsuming = false;
        //#endregion

        this.setJsonResponse(true, 204, "ACK başarıyla işlendi.", res);
    }
    sendNack(req: Request, res: Response) {
        //#region check parameters
        const channelId: string | undefined = req.query.cId?.toString();
        const queueName: string | undefined = req.query.qName?.toString();

        // if parameters is invalid
        if (channelId == undefined
            || queueName == undefined) {
            this.setJsonResponse(false, 400, "Some parameters is invalid.", res);
            return;
        }

        // if "channelId" not found
        if (!this.isChannelExists(channelId)) {
            this.setJsonResponse(false, 404, "Channel not found.", res);
            return;
        }

        // if "queueName" not found
        if (!this.isQueueExists(channelId, queueName)) {
            this.setJsonResponse(false, 404, `Queue with "${queueName}" name not found.`, res);
            return;
        }
        //#endregion

        //#region pre-check before handle
        // if queue is not consuming
        const queue = channels[channelId][queueName];
        if (!queue.isConsuming) {
            this.setJsonResponse(false, 400, `Queue with "${queueName}" name is not consuming. You can't send NACK to queue which not consuming.`, res);
            return;
        }
        //#endregion

        //#region handle ack
        // add message with nack to "end of array"
        const messageWithNack = queue.messages.splice(0, 1)[0];  // by FIFO
        queue.messages.push(messageWithNack);
        queue.nackCount += 1;
        queue.isConsuming = false;
        //#endregion

        this.setJsonResponse(true, 204, "NACK başarıyla işlendi.", res);
    }
    createChannel(req: Request, res: Response) {
        const channelId: string = crypto.randomUUID();

        // if "channelId" is conflicted
        if (this.isChannelExists(channelId)) {
            this.setJsonResponse(false, 409, "Channel is already exists.", res);
            return;
        }

        // create empty channel
        channels[channelId] = {};

        this.setJsonResponse(true, 200, channelId, res);
    }
    createQueueOnChannel(req: Request, res: Response) {
        const channelId: string | undefined = req.query.cId?.toString();
        const queueName: string | undefined = req.query.qName?.toString();

        // if parameters is invalid
        if (channelId == undefined
            || queueName == undefined) {
            this.setJsonResponse(false, 400, "Some parameters is invalid.", res);
            return;
        }

        // if "channelId" not found
        if (!this.isChannelExists(channelId)) {
            this.setJsonResponse(false, 404, "Channel not found.", res);
            return;
        }

        // if "queueName" is conflicted
        if (this.isQueueExists(channelId, queueName)) {
            this.setJsonResponse(false, 409, `Queue with "${queueName}" name is already exists.`, res);
            return;
        }

        // create queue in the channel
        channels[channelId][queueName] = {
            messages: [],
            ackCount: 0,
            nackCount: 0,
            isConsuming: false
        }

        this.setJsonResponse(true, 200, queueName, res);
    }
    addMessageToQueue(req: Request, res: Response) {
        const channelId: string | undefined = req.query.cId?.toString();
        const queueName: string | undefined = req.query.qName?.toString();
        const message: string | undefined = req.query.msg?.toString();

        // if parameters is invalid
        if (channelId == undefined
            || queueName == undefined
            || message == undefined) {
            this.setJsonResponse(false, 400, "Some parameters is invalid.", res);
            return;
        }

        // if channel not found
        if (!this.isChannelExists(channelId)) {
            this.setJsonResponse(false, 404, "Channel not found.", res);
            return;
        }

        // if queue is not found on the channel
        if (!this.isQueueExists(channelId, queueName)) {
            this.setJsonResponse(false, 404, `Queue with "${queueName}" name not found.`, res);
            return;
        }

        // add message to the queue on the channel
        channels[channelId][queueName].messages.push(message);

        this.setJsonResponse(true, 200, "Message is added.", res);
    }
    consumeTheQueue(req: Request, res: Response) {
        //#region check parameters
        const channelId: string | undefined = req.query.cId?.toString();
        const queueName: string | undefined = req.query.qName?.toString();

        // if parameters is invalid
        if (channelId == undefined
            || queueName == undefined) {
            this.setJsonResponse(false, 400, "Some parameters is invalid.", res);
            return;
        }

        // if channel not found
        if (!this.isChannelExists(channelId)) {
            this.setJsonResponse(false, 404, "Channel not found.", res);
            return;
        }

        // if queue is not found on the channel
        if (!this.isQueueExists(channelId, queueName)) {
            this.setJsonResponse(false, 404, `Queue with "${queueName}" name not found.`, res);
            return;
        }
        //#endregion

        //#region pre-check before consume
        // if queue is in critical section, do not anything until critical section is completed
        const queue = channels[channelId][queueName];
        if (queue.isConsuming) {
            this.setJsonResponse(false, 409, `Queue with "${queueName}" name is currently being consumed by others. Please try again later.`, res);
            return;
        }

        // if queue is empty
        if (queue.messages.length === 0) {
            this.setJsonResponse(false, 404, `Queue with "${queueName}" name is empty.`, res);
            return;
        }
        //#endregion

        //#region consume the queue
        const messageCount = queue.messages.length;
        const message = queue.messages[0];  // by FIFO
        queue.isConsuming = true;
        //#endregion

        this.setJsonResponse(
            true,
            200,
            {
                message: message != undefined ? message : null,
                messageCount: messageCount
            },
            res);
    }
    getInfosOfAllChannels(req: Request, res: Response) {
        this.setJsonResponse(true, 200, channels, res);
    }
}

export default new AppController();