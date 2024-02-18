import { Writable } from "stream";
import { buildMessage, safeParseJSON } from "../../utils/index.js";
import fs from "fs";
import { clientsConnected } from "../clients.js";
import { map } from "../map.js";
import { items } from "../items.js";
import { npcs } from "../npcs.js";

export const MessageStream = { parseMessageStream: null };
const look = (client, [direction] = []) => {
  const roomId = client.player.roomId;
  const roomDescription = map[roomId].description;
  // describe people in the room
  const playersInRoom = Object.entries(clientsConnected).filter(
    ([id, otherClient]) =>
      id !== `${client.id}` && otherClient.player.roomId === roomId
  );
  const playersDescription = playersInRoom.length
    ? playersInRoom
        .map(
          ([id, otherClient]) =>
            `${otherClient.player.name}, a fellow adventurer`
        )
        .join("\n")
    : "";
  const npcsInRoom = Object.values(npcs).filter((npc) => npc.roomId === roomId);
  const npcsDescription = npcsInRoom.length
    ? npcsInRoom.map((npc) => npc.description).join("\n")
    : "";

  const peopleDescription = `${
    playersInRoom.length || npcsInRoom.length
      ? `You see:${playersInRoom.length ? "\n" + playersDescription : ""}${
          npcsInRoom.length ? "\n" + npcsDescription : ""
        }`
      : ""
  }`;

  // describe items in the room
  const items = map[roomId].items;
  let itemsDescription = "";
  if (items.length) {
    itemsDescription =
      "On the ground you see:\n" +
      items
        .map(({ item: { name }, quantity }) => `${name} x${quantity}`)
        .join("\n");
  }
  const description = `${roomDescription}${
    itemsDescription !== "" ? "\n" + itemsDescription : ""
  }${peopleDescription !== "" ? "\n" + peopleDescription : ""}`;

  sendMessageToClient(client, description);
};

const oppositeDirectionDict = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

const knownCommands = {
  drop: (client, [itemName, quantity = 1]) => {
    const roomId = client.player.roomId;
    const room = map[roomId];
    const itemEntry = client.player.inventory.find(
      (item) => item.item.name === itemName
    );
    let responseText = `You do not have a ${itemName} to drop.`;
    let actualQuantity = 0;
    if (itemEntry) {
      actualQuantity = Math.min(quantity, itemEntry.quantity);
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
      responseText = `You drop ${actualQuantity} ${itemName}.`;
    }
    // notify other players in the room
    const otherPlayersText = `${client.player.name} drops ${actualQuantity} ${itemName}.`;

    sendMessageToRoom(otherPlayersText, roomId, [`${client.id}`]);
    sendMessageToClient(client, responseText);
  },
  get: (client, [itemName, quantity = 1]) => {
    const roomId = client.player.roomId;
    const room = map[roomId];
    const item = room.items.find(({ item }) => item.name === itemName);
    let responseText = `There is no ${itemName} to get.`;
    let actualQuantity = 0;
    if (item) {
      actualQuantity = Math.min(quantity, item.quantity);
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
      responseText = `You pick up ${actualQuantity} ${itemName}.`;
    }
    sendMessageToClient(client, responseText);
    // notify other players in the room
    const otherPlayersText = `${client.player.name} picks up ${actualQuantity} ${itemName}.`;
    sendMessageToRoom(otherPlayersText, roomId, [`${client.id}`]);
  },
  give: (client, [player, itemName, quantity = 1]) => {
    const roomId = client.player.roomId;
    const room = map[roomId];
    const itemEntry = client.player.inventory.find(
      (entry) => entry.item.name === itemName
    );
    let responseText = `You do not have a ${itemName} to give.`;
    let actualQuantity = 0;
    if (itemEntry) {
      actualQuantity = Math.min(quantity, itemEntry.quantity);
      // remove item from player inventory
      itemEntry.quantity -= actualQuantity;
      // remove item if quantity is 0 or less
      if (itemEntry.quantity <= 0) {
        client.player.inventory = client.player.inventory.filter(
          (entry) => entry.item.name !== itemName
        );
      }
      // add item to player inventory
      const otherClient = Object.values(clientsConnected).find(
        (otherClient) => otherClient.player.name === player
      );
      if (otherClient) {
        const otherClientItem = otherClient.player.inventory.find(
          (item) => item.item.name === itemName
        );
        if (otherClientItem) {
          otherClientItem.quantity += actualQuantity;
        } else {
          otherClient.player.inventory.push({
            item: items[itemName],
            quantity: actualQuantity,
          });
        }
        responseText = `You give ${player} ${actualQuantity} ${itemName}.`;
        const incomingText = `${client.player.name} gives you ${actualQuantity} ${itemName}.`;
        sendMessageToClient(otherClient, incomingText);
        // notify other players in the room
        const otherPlayersText = `${client.player.name} gives ${player} ${actualQuantity} ${itemName}.`;
        sendMessageToRoom(otherPlayersText, roomId, [
          `${client.id}`,
          `${otherClient.id}`,
        ]);
      } else {
        responseText = `There is no player named ${player}.`;
      }
    }
    sendMessageToClient(client, responseText);
  },
  inventory: (client) => {
    const inventory = client.player.inventory;
    // default message if inventory is empty
    let inventoryText = "Your inventory is empty.";
    if (inventory.length) {
      inventoryText =
        "\n" +
        inventory
          .map(({ item, quantity }) => `${item.name} x${quantity}`)
          .join("\n");
    }

    sendMessageToClient(client, inventoryText);
  },
  look,
  move: (client, [direction]) => {
    const oldRoomId = client.player.roomId;
    const room = map[oldRoomId];
    const oppositeDirection = oppositeDirectionDict[direction];
    const exit = room.exits[direction];
    const key = exit?.key;
    const hasKey =
      key === undefined ||
      client.player.inventory.find(({ item }) => item.id === exit.key.id);
    if (exit && (!exit.locked || hasKey)) {
      const newRoomId = exit.id;
      client.player.roomId = newRoomId;
      const description = exit.description;

      // tell the player they entered a new room
      const playerGoingText1 = `---
You move to the ${direction}.`;
      sendMessageToClient(client, playerGoingText1);
      look(client);
      // tell the other players someone entered the room
      const enterText = `${client.player.name} enters the area${
        oppositeDirection ? ` from the ${oppositeDirection}` : ""
      }.`;
      const playersInNewRoom = Object.entries(clientsConnected).filter(
        ([id, otherClient]) =>
          id !== `${client.id}` && otherClient.player.roomId === newRoomId
      );
      playersInNewRoom.forEach(([id, client]) => {
        sendMessageToClient(client, enterText);
      });

      // tell the other players someone left the room
      const leaveText = `${client.player.name} leaves the area heading ${direction}.`;
      const playersInOldRoom = Object.entries(clientsConnected).filter(
        ([id, otherClient]) =>
          id !== `${client.id}` && otherClient.player.roomId === oldRoomId
      );
      playersInOldRoom.forEach(([id, client]) => {
        sendMessageToClient(client, leaveText);
      });
    } else if (exit && exit.locked) {
      sendMessageToClient(client, exit.lockedMessage);
    } else {
      const playerBlockedText = "You cannot go that way.";
      sendMessageToClient(client, playerBlockedText);
    }
  },
  name: (client, [name]) => {
    client.player.name = name;
    const messageText = `${name} has joined the game.`;
    // tell the other players someone entered the room
    const playersInRoom = Object.entries(clientsConnected).filter(
      ([id, otherClient]) => id !== `${client.id}`
    );

    playersInRoom.forEach(([id, client]) => {
      sendMessageToClient(client, messageText);
    });
  },
  talk: (client, [npcName, topic = "default"]) => {
    const roomId = client.player.roomId;
    const npc = Object.values(npcs).filter((npc) =>
      npc.tags.includes(npcName)
    )[0];
    if (npc && npc.roomId === roomId) {
      const message =
        npc.messages[topic] || `I don't know anything about ${topic}.}`;
      sendMessageToClient(client, message, npc.name);
    } else {
      const outGoingText = `There is no ${npcName} here.`;
      sendMessageToClient(client, outGoingText);
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
        const outGoingText = data;
        const playersInRoom = getPlayersInRoom(client.player.roomId);

        // user is in room too
        if (playersInRoom.length > 1) {
          // consider npcs in the room?
          sendMessageToRoom(
            outGoingText,
            client.player.roomId,
            [`${client.id}`],
            from
          );
        } else {
          const noOneToHearText = "There is no one here to hear you.";
          sendMessageToClient(client, noOneToHearText);
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

function getPlayersInRoom(roomId) {
  return Object.entries(clientsConnected).filter(
    ([id, otherClient]) => otherClient.player.roomId === roomId
  );
}

function sendMessageToClient(client, text, from = "World") {
  client.writeStream.write(Buffer.from(buildMessage("text", text, from)));
}

function sendMessageToRoom(text, roomId, excludeIds = [], from = "World") {
  const playersInRoom = getPlayersInRoom(roomId);
  playersInRoom.forEach(([id, client]) => {
    if (!excludeIds.includes(id)) {
      sendMessageToClient(client, text, from);
    }
  });
}
