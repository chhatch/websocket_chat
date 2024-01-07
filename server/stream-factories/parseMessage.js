import { Writable } from "stream";
import { buildMessage, safeParseJSON } from "../../utils/index.js";
import fs from "fs";
import { clientsConnected } from "../clients.js";

export const MessageStream = { parseMessageStream: null };

export const parseMessageBuilder = (clientId) => {
  const client = clientsConnected[clientId];
  return new Writable({
    write(chunk, encoding, next) {
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
          client.writeStream.write(Buffer.from(outGoingMessage));
        } else {
          console.log(`Unknown server command: ${data}`);
        }
      } else if (type === "text") {
        const outGoingMessage = buildMessage("text", data, from);
        Object.entries(clientsConnected).forEach(([id, client]) => {
          if (id !== `${clientId}`)
            client.writeStream.write(Buffer.from(outGoingMessage));
        });
      } else {
        console.log(
          `Received unrecognized message.\ntype: ${type}\nfrom: ${from}\ndata: ${data}`
        );
      }

      next();
    },
  });
};
