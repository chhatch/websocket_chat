import { items } from "./items.js";

const buildRoom = (id, description, items = []) => ({
  id,
  description,
  exits: {},
  items,
});

let roomId = 0;

const startingRoom = buildRoom(
  roomId++,
  "You are in a room. There is a door to the north."
);

const nextRoom = buildRoom(
  roomId++,
  "You are in another room. There is a door to the south.",
  [{ item: items["pewter mug"], quantity: 1 }]
);

startingRoom.exits.north = nextRoom;
nextRoom.exits.south = startingRoom;

export const map = [startingRoom, nextRoom].reduce((acc, room) => {
  acc[room.id] = room;
  return acc;
}, {});
