import { items } from "./items.js";

let roomId = 0;
const buildRoom = (description, items = []) => ({
  id: roomId++,
  description,
  exits: {},
  items,
});

// town
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
The grimy rug by your feet is oddly crumpled. There is no shopkeeper in sight.
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

// the northern road
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

// the tunnels beneath the town
const stairsEntrance = buildRoom(
  `You are at the top of a spiral staircase leading down into darkness.
  A faint light glows from below.
  Above you is the trap door leading back to the item shop.`
);

const stairsBottom = buildRoom(
  `You are at the bottom of a spiral staircase leading up into darkness.
  A faint light glows from above.
  There are collapsed tunnels to the south and east.
  To the west is a torchlit tunnel leading deeper into the earth.`
);

const tunnelSplit = buildRoom(
  `There are cobwebs everywhere, but the tunnel is clear.
Oddly, a few torches burn on the walls. You hear the sound of running water.
The passage splits to the north and south.
The stairs leading back up are to the east.`
);

const tunnelN = buildRoom(
  `An odd looking piece of machinery hums gently in the center of the room.
The stone walls are slick with moisture.
To west the tunnel grows dim.
From the south you faintly hear the sound of running water.`
);

const tunnelNW = buildRoom(
  `The tunnel is dark and damp here. Most of the torches have burned out or been knocked from the walls.
A middle aged man lies dead on the floor. His face frozen in an wide-eyed shriek of terror. He appears intact, but his skin is pale and his eyes are milky white.
The tunnel is brighter to the east.
The tunnel continues south, but you feel a cold breeze coming from that direction.`,
  [{ item: items["coin"], quantity: 2 }]
);

const tunnelS = buildRoom(
  `You hear the water loud and clear now. It almost sounds like a river.
Through a rusty grate on the floor you can see a stream rushing by.
Yellow slime grows on the walls and floor.
The tunnel continues north and west.`,
  [{ item: items["coin"], quantity: 1 }]
);

const tunnelSW = buildRoom(
  `You are in a small room with a pool of water in the center.
A smashed chest lies in the corner.
You hear the sound of flowing water to the east.
The tunnel continues north, but you feel a cold breeze coming from that direction.`
);

const chamber = buildRoom(
  `You are in a large, circular chamber with a high ceiling. Torches burn brightly on the walls.
Macabre statues carved from black stone stand in alcoves around the room. They range from obscene to bloodcurdling.
An altar stands in the center of the room. It is stained with blood.
An ornate door is set into the wall on the west side of the room. It is closed.
Tunnels lead north and south.`
);

const forgottenSanctum = buildRoom(
  `You have discovered the Forgotten Sanctum.
The chamber is vast. Burning torches adorn large columns arranged in a circle at its center.
Shadows dance across the walls, creating an illusion of figures engaged in long-forgotten rituals.
Mysterious whispers echo through the air, carrying fragments of the settlement's past. The whispers are both haunting and alluring.
You hope the exit is still to the east.`,
  [{ item: items["scepter"], quantity: 1 }]
);

itemShop.exits.down = stairsEntrance;
stairsEntrance.exits.up = itemShop;
stairsEntrance.exits.down = stairsBottom;
stairsBottom.exits.up = stairsEntrance;
stairsBottom.exits.west = tunnelSplit;
tunnelSplit.exits.east = stairsBottom;
tunnelSplit.exits.north = tunnelN;
tunnelN.exits.south = tunnelSplit;
tunnelSplit.exits.south = tunnelS;
tunnelS.exits.north = tunnelSplit;
tunnelN.exits.west = tunnelNW;
tunnelNW.exits.east = tunnelN;
tunnelS.exits.west = tunnelSW;
tunnelSW.exits.east = tunnelS;
tunnelNW.exits.south = chamber;
chamber.exits.north = tunnelNW;
tunnelSW.exits.north = chamber;
chamber.exits.south = tunnelSW;
chamber.exits.west = forgottenSanctum;
forgottenSanctum.exits.east = chamber;

// lock the sanctum door
chamber.exits.west.locked = true;
chamber.exits.west.key = items["key"];
chamber.exits.west.lockedMessage = `The door is locked.`;

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
  stairsEntrance,
  stairsBottom,
  tunnelSplit,
  tunnelN,
  tunnelNW,
  tunnelS,
  tunnelSW,
  chamber,
].reduce((acc, room) => {
  acc[room.id] = room;
  return acc;
}, {});
