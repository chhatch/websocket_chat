import { createWebSocketStream, WebSocketServer } from "ws";
import { parseMessageBuilder } from "./parseMessage.js";
import { parseInputBuilder } from "./parseInput.js";

const wsServer = new WebSocketServer({ port: 8080 });

wsServer.on("connection", (ws) => {
  const wsStream = createWebSocketStream(ws, { encoding: "utf8" });
  const parseInputStream = parseInputBuilder("Server", ws);
  const parseMessageStream = parseMessageBuilder("Server");

  wsStream.pipe(parseMessageStream).pipe(process.stdout);
  process.stdin.pipe(parseInputStream).pipe(wsStream);

  console.log("Server connected.");
});

wsServer.on("close", () => {
  console.log("Server disconnected.");
  process.stdin.unpipe();
});
