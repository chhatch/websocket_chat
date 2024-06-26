import { createWebSocketStream, WebSocketServer } from "ws";
import { buildMessage } from "../utils/index.js";
import {
  parseInputBuilder,
  parseMessageBuilder,
} from "./stream-factories/index.js";
import { clientsConnected } from "./clients.js";
import { items } from "./items.js";
import dotenv from "dotenv";

dotenv.config();

const [port = 8080] = process.argv.slice(2);

const wsServer = new WebSocketServer({ port, clientTracking: true });
let id = 0;

wsServer.on("connection", (ws) => {
  const wsId = id++;
  const client = { id: wsId };
  clientsConnected[wsId] = client;
  ws.on("error", console.error);
  ws.on("close", () => {
    delete clientsConnected[wsId];
    console.log("Connection closed.");
    console.log(`${client.player.name} has left the game.`);

    // broadcast to other players
    Object.values(clientsConnected).forEach((otherClient) => {
      otherClient.writeStream.write(
        buildMessage(
          "text",
          `${client.player.name} has left the game.`,
          "World"
        )
      );
    });
  });

  const wsStream = createWebSocketStream(ws, { encoding: "utf8" });
  const clientParser = parseMessageBuilder(wsId);
  client.writeStream = wsStream;
  client.readStream = wsStream.pipe(clientParser);

  // add player to client
  client.player = {
    roomId: 1,
    inventory: [{ item: items["canteen"], quantity: 1 }],
  };

  const otherPlayersOnline = Object.keys(clientsConnected).length - 1;
  client.writeStream.write(
    buildMessage(
      "text",
      `Welcome to Mistfall Hollow. The Whispering Fen awaits.\n${
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
