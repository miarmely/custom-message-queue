import express from "express";
import bodyParser from "body-parser";

import appCtl from "./controllers/appController"
import variables from "../../sharedResources/src/variables"
import channels from "../../sharedResources/src/channels"

const PORT = 3000;
const app = express()
app.use(bodyParser.json());

app.post("/register", async (req, res) => await appCtl.registerAsync(req, res))

app.listen(PORT, async () => {
    //#region add new "channel" for "app controller"
    // const axiosRes = await axios.get(variables.baseApiUrl_microservice + "channel/add");
    const res = await fetch(variables.baseApiUrl_microservice + "channel/add");
    const servRes = await res.json();
    if (!servRes.isSuccess) {
        console.log(servRes.data);
        return;
    }

    const channelId = servRes.data;
    const channelName = "app-controller";
    channels.addChannelDetails({
        channelId,
        channelName
    });

    console.log(`INFO - "app-controller" channel is added.`);
    //#endregion

    //#region add "queues" to the channel
    const queueNames = ["register"];
    for (const qName of queueNames) {
        const res2 = await fetch(variables.baseApiUrl_microservice + "queue/add?" +
            `cId=${channelId}&` +
            `qName=${qName}`
        );
        const servRes2 = await res2.json();

        if (!servRes2.isSuccess) {
            console.log(servRes2.data);
            return;
        }

        console.log(`INFO - Queue with "${qName}" name is added to "${channelName}" channel.`)
    }
    //#endregion

    console.log(`Api server of "MiarRabbitMQ.Api" is started at "${PORT}" port.`);
});