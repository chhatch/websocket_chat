import { Writable } from "stream";
import { buildMessage, safeParseJSON } from "../../utils/index.js";
import fs from "fs";
import { clientsConnected } from "../clients.js";
import { map } from "../map.js";
import { items } from "../items.js";

export const MessageStream = { parseMessageStream: null };
const look = (client, [direction] = []) => {
  const roomId = client.player.roomId;
  const roomDescription = map[roomId].description;
  // describe items in the room
  const items = map[roomId].items;
  let itemsDescription = false;
  if (items.length) {
    itemsDescription =
      "On the ground you see:\n" +
      items
        .map(({ item: { name }, quantity }) => `${name} x${quantity}`)
        .join("\n");
  }
  const description = itemsDescription
    ? `${roomDescription}\n${itemsDescription}`
    : roomDescription;
  const outGoingMessage = buildMessage("text", description, "World");
  client.writeStream.write(Buffer.from(outGoingMessage));
};

const knownCommands = {
  drop: (client, [itemName, quantity = 1]) => {
    const roomId = client.player.roomId;
    const room = map[roomId];
    const itemEntry = client.player.inventory.find(
      (item) => item.item.name === itemName
    );
    let responseMessage = `You do not have a ${itemName} to drop.`;
    if (itemEntry) {
      const actualQuantity = Math.min(quantity, itemEntry.quantity);
      // remove item from player inventory
      itemEntry.quantity -= actualQuantity;
      // remove item if quantity is 0 or less
      if (itemEntry.quantity <= 0) {
        client.player.inventory = client.player.inventory.filter(
          (entry) => entry.item.name !== itemName
        );
      }
      // add item to room
      const roomItemEntry = room.items.find(
        (item) => item.item.name === itemName
      );
      if (roomItemEntry) {
        roomItemEntry.quantity += actualQuantity;
      } else {
        room.items.push({ item: items[itemName], quantity: actualQuantity });
      }
      responseMessage = `You drop ${actualQuantity} ${itemName}.`;
    }
    const outGoingMessage = buildMessage("text", responseMessage, "World");
    client.writeStream.write(Buffer.from(outGoingMessage));
  },
  get: (client, [itemName, quantity = 1]) => {
    const roomId = client.player.roomId;
    const room = map[roomId];
    const item = room.items.find(({ item }) => item.name === itemName);
    let responseMessage = `There is no ${itemName} to get.`;
    if (item) {
      const actualQuantity = Math.min(quantity, item.quantity);
      // remove item from room
      item.quantity -= actualQuantity;
      // remove item if quantity is 0 or less
      if (item.quantity <= 0) {
        room.items = room.items.filter((entry) => entry.item.name !== itemName);
      }
      // add item to player inventory
      const playerItem = client.player.inventory.find(
        (item) => item.item.name === itemName
      );
      if (playerItem) {
        playerItem.quantity += actualQuantity;
      } else {
        client.player.inventory.push({
          item: items[itemName],
          quantity: actualQuantity,
        });
      }
      responseMessage = `You pick up ${actualQuantity} ${itemName}.`;
    }
    const outGoingMessage = buildMessage("text", responseMessage, "World");
    client.writeStream.write(Buffer.from(outGoingMessage));
  },
  inventory: (client) => {
    const inventory = client.player.inventory;
    // default message if inventory is empty
    let inventoryMessage = "Your inventory is empty.";
    if (inventory.length) {
      inventoryMessage = inventory
        .map(({ item, quantity }) => `${item.name} x${quantity}`)
        .join("\n");
    }
    const outGoingMessage = buildMessage(
      "text",
      inventoryMessage,
      "Your Inventory"
    );
    client.writeStream.write(Buffer.from(outGoingMessage));
  },
  look,
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
      client.writeStream.write(Buffer.from(playerGoingMessage1));
      look(client);
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
