import { Transform } from "stream";
import { buildMessage, safeParseJSON } from "../../utils/index.js";
import fs from "fs";

export const MessageStream = { parseMessageStream: null };

export const parseMessageBuilder = (client) =>
  new Transform({
    transform(chunk, encoding, next) {
      const {
        type,
        data,
        from = "Received",
      } = safeParseJSON(chunk.toString().trim());

      // handle server commands
      if (type === "server_command") {
        if (data === "look") {
          const description =
            "You are in a room. There is a door to the north.";
          const outGoingMessage = buildMessage("text", description, "World");
          client.write(Buffer.from(outGoingMessage));
        } else {
          console.log(`Unknown server command: ${data}`);
        }
      }
      // otherwise, pass the message along
      else {
        this.push(chunk);
      }

      next();
    },
  });
