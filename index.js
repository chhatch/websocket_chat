import { createWebSocketStream, WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log(`Server received: ${data}`);
    // ws.send("Awesome! Good job, buddy!");
  });

  console.log("Server connected.");
});

const wsClient = new WebSocket("ws://localhost:8080");

wsClient.on("error", console.error);

wsClient.on("open", function open() {
  console.log("Client connected.");
  //   wsClient.send("I'm connected!");
});

wsClient.on("message", function message(data) {
  console.log("Client received: %s", data);
});

const duplex = createWebSocketStream(wsClient, { encoding: "utf8" });

duplex.on("error", console.error);

duplex.pipe(process.stdout);
process.stdin.pipe(duplex);
