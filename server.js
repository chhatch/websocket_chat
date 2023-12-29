import { createWebSocketStream, WebSocketServer } from "ws";
import { parseMessageBuilder } from "./parseMessage.js";
import { parseInputBuilder } from "./parseInput.js";
import { teardown } from "./teardown.js";

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
    client.write(JSON.stringify({ type: "text", data: `Player found!\n` }));
    wsStream.write(JSON.stringify({ type: "text", data: `Player found!\n` }));
  } else {
    waitingClients.push(wsStream);
    wsStream.write(
      JSON.stringify({ type: "text", data: `Waiting for another player...\n` })
    );
  }

  console.log("Client connected.");
});

console.log("Server online.");
