import { Writable } from "stream";
import { buildMessage } from "../../utils/index.js";
import { MessageStream } from "./parseMessage.js";
import { clientsWritable } from "../clients.js";

export const parseInputBuilder = (wsServer) =>
  new Writable({
    write(chunk, encoding, next) {
      const string = chunk.toString().trim();

      // commands
      if (string[0] === "/") {
        if (string === "/close") {
          console.log("Shutting down server..");
          wsServer.close(() => process.exit());
          console.log("Closing connections..");
          wsServer.clients.forEach((client) => client.close());
        } else if (string === "/look") {
          this.push(buildMessage("server_command", "look"));
        } else {
          console.log(`Unknown command: ${string.slice(1)}`);
        }
      }
      // send text
      else {
        const outGoingMessage = buildMessage("text", string, "Gods");
        clientsWritable.write(outGoingMessage);
      }
      next();
    },
  });
