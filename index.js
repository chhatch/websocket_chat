import { createWebSocketStream, WebSocket, WebSocketServer } from "ws";
import { Transform } from "stream";

const parseInputTransformBuilder = (label, ws) =>
  new Transform({
    transform(chunk, encoding, next) {
      const string = chunk.toString().trim();
      if (string[0] === ":") {
        if (string === ":close") {
          ws.close();
        }
      } else this.push(chunk);
      next();
    },
  });

const parseDataTransformBuilder = (label) =>
  new Transform({
    transform(chunk, encoding, next) {
      const string = chunk.toString();
      this.push(`${label} received: ${string}`);
      next();
    },
  });

const wsServer = new WebSocketServer({ port: 8080 });

wsServer.on("connection", function connection(ws) {
  const wsTransform = createWebSocketStream(ws, { encoding: "utf8" });
  wsTransform.pipe(parseDataTransformBuilder("Server")).pipe(process.stdout);
  process.stdin
    .pipe(parseInputTransformBuilder("Server", wsServer))
    .pipe(wsTransform);

  console.log("Server connected.");
});

wsServer.on("close", function close() {
  console.log("Server disconnected.");
  process.stdin.unpipe();
});

const wsClient = new WebSocket("ws://localhost:8080");

wsClient.on("error", console.error);

wsClient.on("open", function open() {
  console.log("Client connected.");
});

wsClient.on("close", function close() {
  console.log("Client disconnected.");
});

const clientTransform = createWebSocketStream(wsClient, { encoding: "utf8" });
clientTransform.on("close", function close() {
  console.log("Client duplex disconnected.");
});

clientTransform.pipe(parseDataTransformBuilder("Client")).pipe(process.stdout);
process.stdin
  .pipe(parseInputTransformBuilder("Client", wsClient))
  .pipe(clientTransform);
