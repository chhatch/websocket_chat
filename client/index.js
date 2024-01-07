import { createWebSocketStream, WebSocket } from "ws";
import {
  parseInputBuilder,
  parseMessageBuilder,
  displayBuilder,
  MessageStream,
} from "./stream-factories/index.js";
import { teardown } from "../teardown.js";
import { inputStream } from "./stream-factories/display.js";

const [name = "rando", address = "ws://localhost:8080"] = process.argv.slice(2);
// console.log(`Connecting to ${address} as ${name}...`);

const ws = new WebSocket(address);

ws.on("error", console.error);

ws.on("open", () => {
  // console.log("Connected to server.");
});

ws.on("close", () => {
  // console.log("Connection closed.");
  teardown();
});
MessageStream.parseMessageStream = parseMessageBuilder(name);

const wsStream = createWebSocketStream(ws, { encoding: "utf8" });
const parseInputStream = parseInputBuilder(name, ws);
const parseMessageStream = MessageStream.parseMessageStream;
const displayStream = displayBuilder();

wsStream.pipe(parseMessageStream).pipe(displayStream);
inputStream.pipe(parseInputStream).pipe(wsStream);
