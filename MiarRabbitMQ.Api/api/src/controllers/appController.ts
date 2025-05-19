import { Request, Response } from "express";
import axios from "axios";

import variables from "../../../sharedResources/src/variables"
import channels from "../../../sharedResources/src/channels";

class AppController {
    private getUserChannel = () => channels.getDetailsOfOneChannel("app-controller");

    private async addMessageToQueueAsync(qName: string, msg: string) {
        // add message to queue
        const res = await fetch(variables.baseApiUrl_microservice + "message/add?" +
            `cId=${this.getUserChannel()?.channelId}&` +
            `qName=${qName}&` +
            `msg=${msg}`
        )
        const servRes = await res.json();

        // if any error occured on microservice
        if (!servRes.isSuccess) {
            console.log(`Error - ${servRes.data}`);
            return false;
        }

        return true;
    }
    public async registerAsync(req: Request, res: Response) {
        try {
            //#region check parameters
            const { firstName, lastName, email } = req.body;

            if (firstName == undefined
                || lastName == undefined
                || email == undefined) {
                res.json({
                    isSuccess: false,
                    statusCode: 400,
                    data: "Some parameters is missing."
                });
                return;
            }
            //#endregion

            //#region add message to the queue
            const serializedBody = JSON.stringify(req.body);
            if (!await this.addMessageToQueueAsync("register", serializedBody)) throw new Error("3");
            //#endregion

            res.json({
                isSuccess: true,
                statusCode: 200,
                data: "Kullanıcı kaydetme isteği başarıyla alındı."
            });
        }
        catch (ex) {
            console.log(ex);
            res.json({
                isSuccess: false,
                statusCode: 500,
                data: "Kayıt aşamasında bir sorun oluştu."
            });
        }
    }
}

export default new AppController();