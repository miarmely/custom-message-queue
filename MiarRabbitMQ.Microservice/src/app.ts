import express from "express";
import appCtl from "./controllers/appController";

const PORT = 13000;
const app = express()

app.get("/channel/add", (req, res) => appCtl.createChannel(req, res));
app.get("/channel/display/all", (req, res) => appCtl.getInfosOfAllChannels(req, res));
app.get("/queue/add", (req, res) => appCtl.createQueueOnChannel(req, res));
app.get("/queue/send/ack", (req, res) => appCtl.sendAck(req, res));
app.get("/queue/send/nack", (req, res) => appCtl.sendNack(req, res));
app.get("/message/add", (req, res) => appCtl.addMessageToQueue(req, res));
app.get("/message/consume", (req, res) => appCtl.consumeTheQueue(req, res));

app.listen(PORT, () => {
    console.log(`Miar_RabbitMQ server is started at "${PORT}" port.`)
});