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
    const oldRoomId = client.player.roomId;
    const room = map[oldRoomId];
    const exit = room.exits[direction];
    if (exit) {
      const newRoomId = exit.id;
      client.player.roomId = newRoomId;
      const description = exit.description;

      // tell the player they entered a new room
      const playerGoingMessage1 = buildMessage(
        "text",
        `You enter the room to the ${direction}.`,
        "World"
      );
      const playerGoingMessage2 = buildMessage("text", description, "World");
      client.writeStream.write(Buffer.from(playerGoingMessage1));
      client.writeStream.write(Buffer.from(playerGoingMessage2));

      // tell the other players someone entered the room
      const enterMessage = buildMessage(
        "text",
        `${client.player.name} enters the room.`,
        "World"
      );
      const playersInNewRoom = Object.entries(clientsConnected).filter(
        ([id, otherClient]) =>
          id !== `${client.id}` && otherClient.player.roomId === newRoomId
      );
      playersInNewRoom.forEach(([id, client]) => {
        client.writeStream.write(Buffer.from(enterMessage));
      });

      // tell the other players someone left the room
      const leaveMessage = buildMessage(
        "text",
        `${client.player.name} leaves the room.`,
        "World"
      );
      const playersInOldRoom = Object.entries(clientsConnected).filter(
        ([id, otherClient]) =>
          id !== `${client.id}` && otherClient.player.roomId === oldRoomId
      );
      playersInOldRoom.forEach(([id, client]) => {
        client.writeStream.write(Buffer.from(leaveMessage));
      });
    } else {
      const playerGoingMessage = buildMessage(
        "text",
        "You cannot go that way.",
        "World"
      );
      client.writeStream.write(Buffer.from(playerGoingMessage));
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
        const playersInRoom = Object.entries(clientsConnected).filter(
          ([id, otherClient]) =>
            id !== `${client.id}` &&
            otherClient.player.roomId === client.player.roomId
        );

        if (playersInRoom.length) {
          playersInRoom.forEach(([id, client]) => {
            client.writeStream.write(Buffer.from(outGoingMessage));
          });
        } else {
          const noOneToHearMessage = buildMessage(
            "text",
            "There is no one here to hear you.",
            "World"
          );
          client.writeStream.write(Buffer.from(noOneToHearMessage));
        }
      } else {
        console.log(
          `Received unrecognized message.\ntype: ${type}\nfrom: ${from}\ndata: ${data}`
        );
      }

      next();
    },
  });
};
