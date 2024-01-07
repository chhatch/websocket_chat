const buildRoom = (id, description) => ({
  id,
  description,
  exits: {},
});

let roomId = 0;

const startingRoom = buildRoom(
  roomId++,
  "You are in a room. There is a door to the north."
);

export const map = [startingRoom].reduce((acc, room) => {
  acc[room.id] = room;
  return acc;
}, {});
