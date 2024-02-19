import { items, itemsReady } from "./items.js";

let roomId = 0;
const buildRoom = (description, items = []) => ({
  id: roomId++,
  description,
  exits: {},
  items,
});

export const map = {};

export const mapReady = itemsReady.then(() => {
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
// staging area, i think we're gonna need to modularize this, im gonna try but ima break it im sure - joe
// these are some stereotypical rooms that could be fun, I am not married to the names or descriptions (yet)
const crystalCavern = buildRoom(
  `You enter a luminous cavern, its walls aglow with myriad crystals. 
  The light dances off the surfaces, creating a kaleidoscope of colors. 
  The air is cool and carries a hint of mineral fragrance. 
  A narrow passage to the north leads back to the surface.`
);
crystalCavern.exits.south = townSquare;

const wraithsForest = buildRoom(
  `The forest is dense and eerie, with a thick mist that clings to every tree. 
  Shadows move in the corner of your eye, and the air is filled with the whispers of the unseen. 
  A barely visible path leads west, back towards civilization.`
);
wraithsForest.exits.west = townSquare; 

const sunkenShipwreck = buildRoom(
  `Beneath the waves lies a ghostly shipwreck, its timbers creaking with the memory of storms. 
  Fish flit through the broken masts, and the treasure glints in the murky light. 
  A rope ladder to the east suggests a way back to the shore.`
);
sunkenShipwreck.exits.east = townSquare; 

const mysticsHut = buildRoom(
  `Nestled in a quiet glen, the hut is shrouded in mystery. 
  Bottles of strange liquids and ancient tomes line the shelves. 
  The air is heavy with the scent of herbs and incense. 
  A path winds back to the town to the north.`
);
mysticsHut.exits.north = townSquare; 

const enchantedGarden = buildRoom(
  `Surrounded by high walls, this secret garden blooms with otherworldly flowers. 
  Their fragrances blend into a heady perfume. 
  The sound of a hidden fountain is soothing, and a gate to the south leads back to the world outside.`
);
enchantedGarden.exits.south = townSquare; 

const forgottenLibrary = buildRoom(
  `Dust motes float in the air of a vast library, filled with books long forgotten. 
  The silence is profound, broken only by the soft creak of a floorboard. 
  Echoes of ancient knowledge whisper from the shelves. 
  The exit lies to the east.`
);
forgottenLibrary.exits.east = townSquare;

const abandonedMill = buildRoom(
  `You find yourself in front of an old, abandoned mill. 
  Its once-powerful gears are now silent, covered in ivy and moss. 
  The wind carries the faint scent of old grain. 
  The doorway, though worn, invites you inside, where the shadows seem to hold secrets of a time long past. 
  To the north, the faint path seems to lead back to the town, whispering tales of those who once brought their harvests here to be ground.`
);
abandonedMill.exits.north = townSquare;

 // THE NORTHERN ROAD
  const northernRoad1 = buildRoom(
    `You are on a road leading north into the Whispering Fen.
You hear the sounds of the fen all around you. It is unnerving.
The road continues to the north. Mistfall Hollow lies to the south.`
  );

  const northernRoad2 = buildRoom(`You are on a road in the Whispering Fen.
Beasts sound close; you can hear them moving in the shadows.
The stench of rotting vegetation is overwhelming.
The road bends eastward, but a small path leads north. 
To the south the road leads back toward Mistfall Hollow.`);

  const deadEnd = buildRoom(`You are on a small path in the Whispering Fen.
The path ends in a bog with a wagon half-sunken into the mud.
The cypress trees loom overhead. The air is thick with mist.
The only way out is to the south.`);

  const chapelClearing = buildRoom(`The road opens into a soggy clearing choked with thorns and briars.
Overrun with vegetation, a ruined chapel stands in the center of the clearing.
It is altogether too quiet here. 
Moving further east you think you might be able to enter the old chapel.
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

// THE EASTERN ROAD THE EASTERN ROAD THE EASTERN ROAD THE EASTERN ROAD THE EASTERN ROAD
// The Blossom Trail
const easternRoad1 = buildRoom(
  `You are on a charming trail lined with vibrant blossoms. 
  The fragrance of flowers fills the air, providing a momentary reprieve from your adventures. 
  The trail stretches eastward, beckoning you forward, while the town lies to the west.`
);
eastEdgeOfTown.exits.east = easternRoad1;
easternRoad1.exits.west = eastEdgeOfTown;

// The Echoing Canyon
const easternRoad2 = buildRoom(
  `The trail leads you to the edge of a vast canyon. 
  Echoes bounce off the steep walls, turning whispers into roars. 
  A narrow bridge crosses the chasm to the east, offering the only path forward.`
);
easternRoad1.exits.east = easternRoad2;
easternRoad2.exits.west = easternRoad1;
easternRoad2.exits.north = mysticsHut;
mysticsHut.exits.south = easternRoad2;
easternRoad2.exits.south = crystalCavern;
crystalCavern.exits.north = easternRoad2;

// The Shifting Sands
const easternRoad3 = buildRoom(
  `Beyond the canyon lies a stretch of shifting sands. 
  The desert is a mosaic of heat and mirages, with dunes that seem to dance under the sun. 
  An ancient, half-buried road marker points eastward, guiding your way.`
);
easternRoad2.exits.east = easternRoad3;
easternRoad3.exits.west = easternRoad2;
easternRoad3.exits.north = forgottenLibrary;
forgottenLibrary.exits.south = easternRoad3;

// The Whispering Woods
const easternRoad4 = buildRoom(
  `The sands give way to the cool shade of whispering woods. 
  Leaves rustle with secrets and the distant sound of a stream promises refreshment. 
  The woods are dense, but a well-trodden path leads eastward through the trees.`
);
easternRoad3.exits.east = easternRoad4;
easternRoad4.exits.west = easternRoad3;
easternRoad4.exits.north = enchantedGarden;
enchantedGarden.exits.south = easternRoad4;
easternRoad4.exits.south = abandonedMill;
abandonedMill.exits.north = easternRoad4;

// The Misty Moor
const easternRoad5 = buildRoom(
  `Emerging from the woods, you find yourself on the edge of a misty moor. 
  The fog hangs low, shrouding the ground in mystery. 
  Lights flicker in the distance, guiding you to the east, where the Crossroads of Destiny await.`
);
easternRoad4.exits.east = easternRoad5;
easternRoad5.exits.west = easternRoad4;
easternRoad5.exits.north = sunkenShipwreck;
sunkenShipwreck.exits.south = easternRoad5;
easternRoad5.exits.south = wraithsForest;
wraithsForest.exits.north = easternRoad5;
//easternRoad5.exits.east = crossroadsOfDestiny;
//crossroadsOfDestiny.exits.west = easternRoad5;


// TUNNELS TUNNELS TUNNELS TUNNELS TUNNELS TUNNELS TUNNELS TUNNELS TUNNELS
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
Oddly, a few torches burn on the walls. 
You hear the sound of running water.
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
    `The tunnel is dark and damp here. 
Most of the torches have burned out or been knocked from the walls.
A middle aged man lies dead on the floor. 
His face frozen in an wide-eyed shriek of terror. 
He appears intact, but his skin is pale and his eyes are milky white.
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
Macabre statues carved from black stone stand in alcoves around the room. 
They range from obscene to bloodcurdling.
A blood stained altar stands in the center of the room.
An ornate door is set into the wall on the west side of the room.
The door appears to be closed.
Tunnels lead north and south.`
  );

  const forgottenSanctum = buildRoom(
    `You have discovered the Forgotten Sanctum.
The chamber is vast. 
Burning torches adorn large columns arranged in a circle at its center.
Shadows dance across the walls, creating an illusion of figures engaged in long-forgotten rituals.
Mysterious whispers echo through the air, carrying fragments of the settlement's past. 
The whispers are both haunting and alluring.
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


  [
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
    forgottenSanctum,
    easternRoad1,
    easternRoad2,
    easternRoad3,
    easternRoad4,
    easternRoad5,
    mysticsHut,
    forgottenLibrary,
    enchantedGarden,
    abandonedMill,
    sunkenShipwreck,
    wraithsForest,
    crystalCavern,

  ].forEach((room) => {
    map[room.id] = room;
  });
});
