import { createWebSocketStream, WebSocket } from "ws";
import {
  parseInputBuilder,
  parseMessageBuilder,
  displayBuilder,
} from "./stream-factories/index.js";
import { teardown } from "./teardown.js";

const [name = "rando", address = "ws://localhost:8080"] = process.argv.slice(2);
console.log(`Connecting to ${address} as ${name}...`);

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
const parseInputStream = parseInputBuilder(name, ws);
const parseMessageStream = parseMessageBuilder(name);
const displayStream = displayBuilder();

wsStream.pipe(parseMessageStream).pipe(displayStream);
process.stdin.pipe(parseInputStream).pipe(wsStream);
