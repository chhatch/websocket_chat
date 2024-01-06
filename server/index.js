import { createWebSocketStream, WebSocketServer } from "ws";
import { buildMessage } from "../utils/index.js";
import { parseMessageBuilder } from "./stream-factories/index.js";

const wsServer = new WebSocketServer({ port: 8080 });
const waitingClients = {};
let id = 0;

wsServer.on("connection", (ws) => {
  const wsId = id++;
  ws.on("error", console.error);
  ws.on("close", () => {
    delete waitingClients[wsId];
    console.log("Connection closed.");
  });

  const client1 = createWebSocketStream(ws, { encoding: "utf8" });

  const waitingClientKeys = Object.keys(waitingClients);

  if (waitingClientKeys.length > 0) {
    const clientKey = waitingClientKeys[0];
    const client2 = waitingClients[clientKey];

    delete waitingClients[clientKey];

    const client1Parser = parseMessageBuilder(client1);
    const client2Parser = parseMessageBuilder(client2);

    client1.pipe(client1Parser).pipe(client2);
    client2.pipe(client2Parser).pipe(client1);
    client2.write(
      buildMessage("text", "Another player has joined!\n", "Server")
    );
    client1.write(
      buildMessage("text", "You have joined another player!\n", "Server")
    );
  } else {
    waitingClients[wsId] = client1;
    client1.write(
      buildMessage("text", "Waiting for another player...", "Server")
    );
  }

  console.log("Client connected.");
});

console.log("Server online.");
