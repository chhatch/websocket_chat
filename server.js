import { createWebSocketStream, WebSocketServer } from "ws";
import { parseMessageBuilder } from "./parseMessage.js";
import { parseInputBuilder } from "./parseInput.js";
import { teardown } from "./teardown.js";
import { buildMessage } from "./utils/build-message.js";

const wsServer = new WebSocketServer({ port: 8080 });
const waitingClients = [];
let id = 0;

wsServer.on("connection", (ws) => {
  ws.on("error", console.error);
  ws.on("close", () => {
    console.log("Connection closed.");
  });

  const wsStream = createWebSocketStream(ws, { encoding: "utf8" });

  if (waitingClients.length > 0) {
    const client = waitingClients.shift();

    client.pipe(wsStream);
    wsStream.pipe(client);
    client.write(
      buildMessage("text", "Another player has joined!\n", "Server")
    );
    wsStream.write(buildMessage("text", "You have joined!\n", "Server"));
  } else {
    waitingClients.push(wsStream);
    wsStream.write(
      buildMessage("text", "Waiting for another player...", "Server")
    );
  }

  console.log("Client connected.");
});

console.log("Server online.");
