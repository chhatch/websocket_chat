import { createWebSocketStream, WebSocketServer } from "ws";
import { buildMessage } from "../utils/index.js";
import {
  parseInputBuilder,
  parseMessageBuilder,
} from "./stream-factories/index.js";
import { clientsConnected } from "./clients.js";

const [port = 8080] = process.argv.slice(2);

const wsServer = new WebSocketServer({ port, clientTracking: true });
let id = 0;

wsServer.on("connection", (ws) => {
  const wsId = id++;
  ws.on("error", console.error);
  ws.on("close", () => {
    delete clientsConnected[wsId];
    console.log("Connection closed.");
  });

  const wsStream = createWebSocketStream(ws, { encoding: "utf8" });
  const clientParser = parseMessageBuilder(wsId);
  const client = { writeStream: wsStream };
  client.readStream = wsStream.pipe(clientParser);

  clientsConnected[wsId] = client;
  const otherPlayersOnline = Object.keys(clientsConnected).length - 1;
  client.writeStream.write(
    buildMessage(
      "text",
      `Welcome to MistFall Hollow.\n${
        otherPlayersOnline
          ? `There are ${otherPlayersOnline} other players online.`
          : "You are all alone.."
      }`,
      "Server"
    )
  );
  console.log("Client connected.");
});

console.log(`Server listening on port ${port}...`);

process.stdin.pipe(parseInputBuilder(wsServer));
