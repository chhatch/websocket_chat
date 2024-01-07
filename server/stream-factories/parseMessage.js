import { Writable } from "stream";
import { buildMessage, safeParseJSON } from "../../utils/index.js";
import fs from "fs";
import { clientsConnected } from "../clients.js";
import { map } from "../map.js";

export const MessageStream = { parseMessageStream: null };

const knownCommands = {
  look: (client, [direction]) => {
    const roomId = client.player.roomId;
    const description = map[roomId].description;
    const outGoingMessage = buildMessage("text", description, "World");
    client.writeStream.write(Buffer.from(outGoingMessage));
  },
  move: (client, [direction]) => {
    const roomId = client.player.roomId;
    const room = map[roomId];
    const exit = room.exits[direction];
    if (exit) {
      client.player.roomId = exit.id;
      const description = exit.description;
      const outGoingMessage1 = buildMessage(
        "text",
        `You enter the room to the ${direction}.`,
        "World"
      );
      const outGoingMessage2 = buildMessage("text", description, "World");
      client.writeStream.write(Buffer.from(outGoingMessage1));
      client.writeStream.write(Buffer.from(outGoingMessage2));
    } else {
      const outGoingMessage = buildMessage(
        "text",
        "You cannot go that way.",
        "World"
      );
      client.writeStream.write(Buffer.from(outGoingMessage));
    }
  },
};

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
        const [commandName, ...args] = data.split(" ");
        const command = knownCommands[commandName];
        if (command) {
          command(client, args);
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
