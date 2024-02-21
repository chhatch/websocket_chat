import { dbClient } from "../db/index.js";
import { items, itemsReady } from "./items.js";
import _ from "lodash";

export const map = {};

const roomsPromise = dbClient.select("*").from("rooms");

export const mapReady = Promise.all([roomsPromise, itemsReady]).then(
  ([rooms]) => {
    const roomsHash = rooms.reduce((acc, room) => {
      acc[room.id] = room;
      return acc;
    }, map);

    rooms.forEach((room) => {
      if (room.items) room.items = updateItems(room);
      else room.items = [];
      if (room.exits) rooms.exits = updateExits(room, roomsHash);
    });
  }
);

function updateItems(room) {
  return room.items.map((item) => ({
    item: items[item.itemId],
    quantity: item.quantity,
  }));
}

function updateExits(room, roomsHash) {
  return _.mapValues(room.exits, (exit) => {
    if (exit.key) exit.key = items[exit.key];
    if (exit.id) return roomsHash[exit.id];
    return exit;
  });
}
