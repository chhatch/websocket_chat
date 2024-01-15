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

const northernRoad1 = buildRoom(
  `You are on a road leading north into the Whispering Fen.
You hear the sounds of the fen all around you. It is unnerving.
The road continues to the north. Mistfall Hollow lies to the south.`
);

const northernRoad2 = buildRoom(`You are on a road in the Whispering Fen.
Beasts sound close; you can hear them moving in the shadows.
The stench of rotting vegetation is overwhelming.
The road bends eastward, but a small path leads north. To the south the road leads back toward Mistfall Hollow.`);

const deadEnd = buildRoom(`You are on a small path in the Whispering Fen.
The path ends in a bog with a wagon sunken into the mud.
The cypress trees loom overhead. The air is thick with mist.
The only way out is to the south.`);

const chapelClearing =
  buildRoom(`The road opens into a soggy clearing choked with thorns and briars.
Overrun with vegetation, a ruined chapel stands in the center of the clearing.
It is altogether too quiet here. Moving further east you think you might be able to enter the old chapel.
The muddy road leads back to the west.`);

const chapel = buildRoom(
  `You clamber through a broken window into the ruined chapel.
Rotting pews and a collapsed roof are all that remain.
The windows are broken and the floor is covered in moss.
The only way out is to the west.`,
  [{ item: items["key"], quantity: 1 }]
);

townSquare.exits.north = northEdgeOfTown;
northEdgeOfTown.exits.south = townSquare;
townSquare.exits.east = eastEdgeOfTown;
eastEdgeOfTown.exits.west = townSquare;
townSquare.exits.south = itemShop;
itemShop.exits.north = townSquare;
townSquare.exits.west = inn;
inn.exits.east = townSquare;

// the northern road
northEdgeOfTown.exits.north = northernRoad1;
northernRoad1.exits.south = northEdgeOfTown;
northernRoad1.exits.north = northernRoad2;
northernRoad2.exits.south = northernRoad1;
northernRoad2.exits.north = deadEnd;
deadEnd.exits.south = northernRoad2;
northernRoad2.exits.east = chapelClearing;
chapelClearing.exits.west = northernRoad2;
chapelClearing.exits.east = chapel;
chapel.exits.west = chapelClearing;

export const map = [
  townSquare,
  northEdgeOfTown,
  eastEdgeOfTown,
  itemShop,
  inn,
  northernRoad1,
  northernRoad2,
  deadEnd,
  chapelClearing,
  chapel,
].reduce((acc, room) => {
  acc[room.id] = room;
  return acc;
}, {});
