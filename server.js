import { createWebSocketStream, WebSocketServer } from "ws";
import { parseMessageBuilder } from "./stream-factories/index.js";
import { parseInputBuilder } from "./stream-factories/index.js";
import { teardown } from "./teardown.js";
import { buildMessage } from "./utils/index.js";

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

  const wsStream = createWebSocketStream(ws, { encoding: "utf8" });

  const waitingClientKeys = Object.keys(waitingClients);

  if (waitingClientKeys.length > 0) {
    const clientKey = waitingClientKeys[0];
    const client = waitingClients[clientKey];

    delete waitingClients[clientKey];

    client.pipe(wsStream);
    wsStream.pipe(client);
    client.write(
      buildMessage("text", "Another player has joined!\n", "Server")
    );
    wsStream.write(
      buildMessage("text", "You have joined another player!\n", "Server")
    );
  } else {
    waitingClients[wsId] = wsStream;
    wsStream.write(
      buildMessage("text", "Waiting for another player...", "Server")
    );
  }

  console.log("Client connected.");
});

console.log("Server online.");
