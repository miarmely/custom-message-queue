import express from "express";
import axios from "axios";

import appCtl from "./controllers/appController"
import variables from "../../sharedResources/src/variables"
import channels from "../../sharedResources/src/channels"

const PORT = 3000;
const app = express()

app.post("/register", async (req, res) => await appCtl.registerAsync(req, res))

app.listen(PORT, async () => {
    //#region add "userChannel"
    const axiosRes = await axios.get(variables.baseApiUrl_microservice + "channel/add");
    const servRes = axiosRes.data;
    if (!servRes.isSuccess) {
        console.log(servRes.data);
        return;
    }

    channels.addChannelDetails({
        channelId: servRes.data,
        channelName: "user"
    });

    console.log(`"user" channel is added.`);
    //#endregion

    console.log(`Api server of "MiarRabbitMQ.Api" is started at "${PORT}" port.`);
});