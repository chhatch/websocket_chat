import { createWebSocketStream, WebSocket } from "ws";
import { parseMessageBuilder } from "./parseMessage.js";
import { parseInputBuilder } from "./parseInput.js";
import { teardown } from "./teardown.js";

const ws = new WebSocket("ws://localhost:8080");

ws.on("error", console.error);

ws.on("open", () => {
  console.log("Connected to server.");
});

ws.on("close", () => {
  console.log("Connection closed.");
  teardown();
});

const wsStream = createWebSocketStream(ws, { encoding: "utf8" });
const parseInputStream = parseInputBuilder("Client", ws);
const parseMessageStream = parseMessageBuilder("Client");

wsStream.pipe(parseMessageStream).pipe(process.stdout);
process.stdin.pipe(parseInputStream).pipe(wsStream);
