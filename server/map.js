import { items } from "./items.js";

let roomId = 0;
const buildRoom = (description, items = []) => ({
  id: roomId++,
  description,
  exits: {},
  items,
});

const townSquare = buildRoom(
  `You are in the town square.
Muddy wagon tracks lead away to the north and east.
A shabby looking item shop lies to the south.
A small inn is to the west.`
);

const northEdgeOfTown = buildRoom(
  `You are at the northern edge of town.
Wagon tracks disappear into the dark cypress forest to the north.
You hear the creatures of the fen in the distance.
The town square is to the south.`
);

const eastEdgeOfTown = buildRoom(
  `You are at the eastern edge of town.
There is a small farm beyond which the forest looms.
A dark shape moves in the shadow of the trees.
The town square is to the west.`
);

const itemShop = buildRoom(
  `You are in a small, poorly lit item shop.
There are shelves of dusty bottles and jars.
A few cheap cloaks hang on the wall.
There is no shopkeeper in sight.
The door to the north leads back to the town square.`
);

const inn = buildRoom(`You enter the Shackled Brier Inn.
The air is thick with smoke and the smell of cheap ale.
A few patrons sit at the bar.
The door to the east leads back to the town square.`);

townSquare.exits.north = northEdgeOfTown;
northEdgeOfTown.exits.south = townSquare;
townSquare.exits.east = eastEdgeOfTown;
eastEdgeOfTown.exits.west = townSquare;
townSquare.exits.south = itemShop;
itemShop.exits.north = townSquare;
townSquare.exits.west = inn;
inn.exits.east = townSquare;

export const map = [
  townSquare,
  northEdgeOfTown,
  eastEdgeOfTown,
  itemShop,
  inn,
].reduce((acc, room) => {
  acc[room.id] = room;
  return acc;
}, {});
