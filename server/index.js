import { createWebSocketStream, WebSocketServer } from "ws";
import { buildMessage } from "../utils/index.js";
import {
  parseInputBuilder,
  parseMessageBuilder,
} from "./stream-factories/index.js";
import { clientsConnected } from "./clients.js";

const wsServer = new WebSocketServer({ port: 8080, clientTracking: true });
const waitingClients = {};
let id = 0;

wsServer.on("connection", (ws) => {
  const wsId = id++;
  ws.on("error", console.error);
  ws.on("close", () => {
    delete waitingClients[wsId];
    delete clientsConnected[wsId];
    console.log("Connection closed.");
  });

  const wsStream = createWebSocketStream(ws, { encoding: "utf8" });
  const client1Parser = parseMessageBuilder(wsStream);
  const client1 = { writeStream: wsStream };
  client1.readStream = wsStream.pipe(client1Parser);

  const waitingClientKeys = Object.keys(waitingClients);

  if (waitingClientKeys.length > 0) {
    const clientKey = waitingClientKeys[0];
    const client2 = waitingClients[clientKey];

    delete waitingClients[clientKey];

    client1.readStream.pipe(client2.writeStream);
    client2.readStream.pipe(client1.writeStream);
    client2.writeStream.write(
      buildMessage("text", "Another player has joined!\n", "Server")
    );
    client1.writeStream.write(
      buildMessage("text", "You have joined another player!\n", "Server")
    );
  } else {
    waitingClients[wsId] = client1;
    client1.writeStream.write(
      buildMessage("text", "Waiting for another player...", "Server")
    );
  }

  clientsConnected[wsId] = client1;
  console.log("Client connected.");
});

console.log("Server online.");

process.stdin.pipe(parseInputBuilder(wsServer));
