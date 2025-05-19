import { Request, Response } from "express";
import axios from "axios";

import variables from "../../../sharedResources/src/variables"
import channels from "../../../sharedResources/src/channels";

class AppController {
    private userChannel = channels.getDetailsOfOneChannel("user");

    async registerAsync(req: Request, res: Response) {
        try {
            //#region if some parameters is invalid
            const { firstName, lastName, email } = req.body;

            if (firstName == undefined
                || lastName == undefined
                || email == email) {
                res.json({
                    isSuccess: false,
                    statusCode: 400,
                    data: "Some parameters is missing."
                });
                return;
            }
            //#endregion

            //#region add queue to channel if not exists
            const queueName = "user-register";
            if (!await this.addQueueToChannelIfNotExistsAsync(queueName)) throw new Error("2");
            //#endregion

            //#region add message to queue
            const serializedBody = JSON.stringify(req.body);
            if (!await this.addMessageToQueueAsync(queueName, serializedBody)) throw new Error("3");
            //#endregion

            res.json({
                isSuccess: true,
                statusCode: 204,
                data: null
            });
        }
        catch (ex) {
            res.json({
                isSuccess: false,
                statusCode: 500,
                data: "Kayıt aşamasında bir sorun oluştu."
            });
        }
    }
    async addQueueToChannelIfNotExistsAsync(qName: string) {
        // add queue to channel
        const axiosRes = await axios.get(variables.baseApiUrl_microservice + "queue/add", {
            params: {
                cId: this.userChannel?.channelId,
                qName: qName
            }
        });
        const servRes = axiosRes.data;

        // if any error occured on microservice
        if (!servRes.isSuccess
            && servRes.statusCode != 409) {  // if query already exists then do not return "false".
            console.log(`Error - ${servRes.data}`);
            return false;
        }

        return true;
    }
    async addMessageToQueueAsync(qName: string, msg: string) {
        // add message to queue
        const axiosRes = await axios.get(variables.baseApiUrl_microservice + "message/add", {
            params: {
                cId: this.userChannel?.channelId,
                qName: qName,
                msg: msg
            }
        });
        const servRes = axiosRes.data;

        // if any error occured on microservice
        if (!servRes.isSuccess) {
            console.log(`Error - ${servRes.data}`);
            return false;
        }

        return true;
    }
}

export default new AppController();