/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  const items = await knex("items").select("*");

  await createRooms(knex, items);
  const rooms = await knex("rooms").select("*");
  const roomsHash = rooms.reduce((acc, room) => {
    acc[room.name] = room;
    return acc;
  }, {});

  addExits(knex, roomsHash, items);

  // update rooms with exits
  await Promise.all(
    Object.values(roomsHash).map((room) => {
      const exits = room.exits;
      if (exits)
        return knex("rooms")
          .where("id", room.id)
          .update({ exits: JSON.stringify(room.exits) });
    })
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {};

function createRooms(knex, items) {
  return knex("rooms").insert([
    //town
    {
      name: "townSquare",
      description: `You are in the town square.
Muddy wagon tracks lead away to the north and east.
A shabby looking item shop lies to the south.
A small inn is to the west.`,
    },
    {
      name: "northEdgeOfTown",
      description: `You are at the northern edge of town.
Wagon tracks disappear into the dark cypress forest to the north.
You hear the creatures of the fen in the distance.
The town square is to the south.`,
    },
    {
      name: "eastEdgeOfTown",
      description: `You are at the eastern edge of town.
There is a small farm beyond which the forest looms.
A dark shape moves in the shadow of the trees.
The town square is to the west.`,
    },
    {
      name: "itemShop",
      description: `You are in a small, poorly lit item shop.
There are shelves of dusty bottles and jars.
A few cheap cloaks hang on the wall.
The grimy rug by your feet is oddly crumpled. There is no shopkeeper in sight.
The door to the north leads back to the town square.`,
    },
    {
      name: "inn",
      description: `You enter the Shackled Brier Inn.
The air is thick with smoke and the smell of cheap ale.
A few patrons sit at the bar.
The door to the east leads back to the town square.`,
    },
    // northern road
    {
      name: "northernRoad1",
      description: `You are on a road leading north into the Whispering Fen.
You hear the sounds of the fen all around you. It is unnerving.
The road continues to the north. Mistfall Hollow lies to the south.`,
    },
    {
      name: "northernRoad2",
      description: `You are on a road in the Whispering Fen.
Beasts sound close; you can hear them moving in the shadows.
The stench of rotting vegetation is overwhelming.
The road bends eastward, but a small path leads north. To the south the road leads back toward Mistfall Hollow.`,
    },
    {
      name: "deadEnd",
      description: `You are on a small path in the Whispering Fen.
The path ends in a bog with a wagon half-sunken into the mud.
The cypress trees loom overhead. The air is thick with mist.
The only way out is to the south.`,
    },
    {
      name: "chapelClearing",
      description: `The road opens into a soggy clearing choked with thorns and briars.
Overrun with vegetation, a ruined chapel stands in the center of the clearing.
It is altogether too quiet here. Moving further east you think you might be able to enter the old chapel.
The muddy road leads back to the west.`,
    },
    {
      name: "chapel",
      description: `You clamber through a broken window into the ruined chapel.
Rotting pews and a collapsed roof are all that remain.
The windows are broken and the floor is covered in moss.
The only way out is to the west.`,
      items: JSON.stringify([
        { itemId: items.find((item) => item.name === "key").id, quantity: 1 },
      ]),
    },
    // tunnels
    {
      name: "stairsEntrance",
      description: `You are at the top of a spiral staircase leading down into darkness.
A faint light glows from below.
Above you is the trap door leading back to the item shop.`,
    },
    {
      name: "stairsBottom",
      description: `You are at the bottom of a spiral staircase leading up into darkness.
A faint light glows from above.
There are collapsed tunnels to the south and east.
To the west is a torchlit tunnel leading deeper into the earth.`,
    },
    {
      name: "tunnelSplit",
      description: `There are cobwebs everywhere, but the tunnel is clear.
Oddly, a few torches burn on the walls. You hear the sound of running water.
The passage splits to the north and south.
The stairs leading back up are to the east.`,
    },
    {
      name: "tunnelN",
      description: `An odd looking piece of machinery hums gently in the center of the room.
The stone walls are slick with moisture.
To west the tunnel grows dim.
From the south you faintly hear the sound of running water.`,
    },
    {
      name: "tunnelNW",
      description: `The tunnel is dark and damp here. Most of the torches have burned out or been knocked from the walls.
A middle aged man lies dead on the floor. His face frozen in an wide-eyed shriek of terror. He appears intact, but his skin is pale and his eyes are milky white.
The tunnel is brighter to the east.
The tunnel continues south, but you feel a cold breeze coming from that direction.`,
      items: JSON.stringify([
        { itemId: items.find((item) => item.name === "coin").id, quantity: 2 },
      ]),
    },
    {
      name: "tunnelS",
      description: `You hear the water loud and clear now. It almost sounds like a river.
Through a rusty grate on the floor you can see a stream rushing by.
Yellow slime grows on the walls and floor.
The tunnel continues north and west.`,
      items: JSON.stringify([
        { itemId: items.find((item) => item.name === "coin").id, quantity: 1 },
      ]),
    },
    {
      name: "tunnelSW",
      description: `You are in a small room with a pool of water in the center.
A smashed chest lies in the corner.
You hear the sound of flowing water to the east.
The tunnel continues north, but you feel a cold breeze coming from that direction.`,
    },
    {
      name: "chamber",
      description: `You are in a large, circular chamber with a high ceiling. Torches burn brightly on the walls.
Macabre statues carved from black stone stand in alcoves around the room. They range from obscene to bloodcurdling.
An altar stands in the center of the room. It is stained with blood.
An ornate door is set into the wall on the west side of the room. It is closed.
Tunnels lead north and south.`,
    },
    {
      name: "forgottenSanctum",
      description: `You have discovered the Forgotten Sanctum.
The chamber is vast. Burning torches adorn large columns arranged in a circle at its center.
Shadows dance across the walls, creating an illusion of figures engaged in long-forgotten rituals.
Mysterious whispers echo through the air, carrying fragments of the settlement's past. The whispers are both haunting and alluring.
You hope the exit is still to the east.`,
      items: JSON.stringify([
        {
          itemId: items.find((item) => item.name === "scepter").id,
          quantity: 1,
        },
      ]),
    },
  ]);
}

function addExits(knex, roomsHash, items) {
  // town
  roomsHash.townSquare.exits = {
    north: { id: roomsHash.northEdgeOfTown.id },
    east: { id: roomsHash.eastEdgeOfTown.id },
    south: { id: roomsHash.itemShop.id },
    west: { id: roomsHash.inn.id },
  };
  roomsHash.northEdgeOfTown.exits = {
    south: { id: roomsHash.townSquare.id },
    north: { id: roomsHash.northernRoad1.id },
  };
  roomsHash.eastEdgeOfTown.exits = {
    west: { id: roomsHash.townSquare.id },
  };
  roomsHash.itemShop.exits = {
    north: { id: roomsHash.townSquare.id },
    down: { id: roomsHash.stairsEntrance.id },
  };
  roomsHash.inn.exits = {
    east: { id: roomsHash.townSquare.id },
  };

  // northern road
  roomsHash.northernRoad1.exits = {
    south: { id: roomsHash.northEdgeOfTown.id },
    north: { id: roomsHash.northernRoad2.id },
  };
  roomsHash.northernRoad2.exits = {
    south: { id: roomsHash.northernRoad1.id },
    north: { id: roomsHash.deadEnd.id },
  };
  roomsHash.deadEnd.exits = {
    south: { id: roomsHash.northernRoad2.id },
  };
  roomsHash.chapelClearing.exits = {
    north: { id: roomsHash.chapel.id },
  };
  roomsHash.chapel.exits = {
    south: { id: roomsHash.chapelClearing.id },
  };

  // tunnels
  roomsHash.stairsEntrance.exits = {
    up: { id: roomsHash.itemShop.id },
    down: { id: roomsHash.stairsBottom.id },
  };
  roomsHash.stairsBottom.exits = {
    up: { id: roomsHash.stairsEntrance.id },
    west: { id: roomsHash.tunnelSplit.id },
  };
  roomsHash.tunnelSplit.exits = {
    east: { id: roomsHash.stairsBottom.id },
    north: { id: roomsHash.tunnelN.id },
    south: { id: roomsHash.tunnelS.id },
  };
  roomsHash.tunnelN.exits = {
    south: { id: roomsHash.tunnelSplit.id },
    west: { id: roomsHash.tunnelNW.id },
  };
  roomsHash.tunnelNW.exits = {
    east: { id: roomsHash.tunnelN.id },
    south: { id: roomsHash.chamber.id },
  };
  roomsHash.tunnelS.exits = {
    north: { id: roomsHash.tunnelSplit.id },
    west: { id: roomsHash.tunnelSW.id },
  };
  roomsHash.tunnelSW.exits = {
    east: { id: roomsHash.tunnelS.id },
    north: { id: roomsHash.chamber.id },
  };
  roomsHash.chamber.exits = {
    north: { id: roomsHash.tunnelNW.id },
    south: { id: roomsHash.tunnelSW.id },
    west: {
      id: roomsHash.forgottenSanctum.id,
      locked: true,
      key: items.find((item) => item.name === "key").id,
    },
  };
  roomsHash.forgottenSanctum.exits = {
    east: { id: roomsHash.chamber.id },
  };
}
