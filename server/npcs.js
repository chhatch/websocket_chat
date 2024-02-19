const buildNpc = ({
  roomId,
  name,
  description,
  inventory,
  messages,
  tags,
}) => ({
  roomId,
  name,
  tags,
  description,
  inventory,
  messages,
});

const guard = buildNpc({
  roomId: 1,
  name: "Sergeant Ealdor",
  tags: ["soldier", "guard", "sergeant", "ealdor"],
  description: "One of the few town guards, a weary and grizzled old soldier.",
  inventory: [],
  messages: {
    chapel:
      "The old chapel? It's been abandoned for years. I don't know why anyone would want to go there. It's up the road north and  a bit east of here.",
    default: "I'm on duty. I can't talk right now.",
    news: "Oh alright, if you'll leave me alone. Something strange is afoot. A suspicious looking hooded figure was seen near the old chapel. The residents are uneasy. That's all I know.",
  },
});

const innkeeper = buildNpc({
  roomId: 4,
  name: "Greta Hearthwood",
  tags: ["innkeeper", "greta", "hearthwood"],
  description: `The innkeeper, a surprisingly young woman with a friendly face.
    Her clothes are plain but clean and well kept.`,
  inventory: [],
  messages: {
    default: `Welcome to the Shackled Brier Inn. I'm Greta.`,
    news: "I've been 'earin folks chattin' 'bout queer noises, they have, seemin' to come up from under the town, innit? I don't know what to make of it, mind.",
  },
});

const herbalist = buildNpc({
  roomId: 2,
  name: "Elara Willowshade",
  tags: ["herbalist", "elara", "willowshade"],
  description: `An herbalist in a dark green cloak humming quietly to herself.
    She is sorting through a basket of herbs near the edge of the forest.`,
  inventory: [],
  messages: {
    default: `Hello, I'm Elara, the local herbalist.`,
    herbs:
      "The fen is rich with herbs. Herbs for healing, herbs for poison, herbs for all sorts of things, but you must know what you're looking for.",
    news: "The forest is quiet. Too quiet. I don't like it.",
  },
});

const farmer = buildNpc({
  roomId: 2,
  name: "Padraig O'Moore",
  tags: ["farmer", "bran", "fieldstead" "padraig"],
  description: `A gruff looking farmer with a pitchfork slung over his shoulder.
    It's hard to tell if he's angry or just tired. His boots are caked with black mud.`,
  inventory: [],
  messages: {
    default: `What is it ye be after, eh? I've got me hands full as it is, so I do.`,
    news: "'Tis been a long stretch of the day, that it has. I'm wearied to the bone, so I am. The creatures of the bog, they've been steerin' clear of the village of late. Eases the load of me toil, it does, but it sits not right with me soul.",
    name: "In another life, some folks called me Bran",
  },
});

const cartographer = buildNpc({
  roomId: 0,
  name: "Astrid Moonshadow",
  tags: ["cartographer", "astrid", "moonshadow"],
  description: `The cartographer, an old woman in a tweed skirt and a woolen shawl.
    She puffs pensively on a pipe as she paces about and studies a map.`,
  inventory: [],
  messages: {
    default: `Huh? Oh, I didn't see you there. I'm Astrid the cartographer.
  I've waited many years to explore this town.`,
    map: "I've been studying this map of the town. It's old, but I believe it's accurate. I'm sorry I don't trust you enough to lend it to you.",
    news: "Mistfall Hollow isn't the firt settlement to be built here. There was a town here long ago, but it was destroyed by a flood. The ruins are still out there somewhere. I believe there are tunnels beneath the town that lead to the ruins.",
    tunnels:
      "I don't know much about them, but if this map is accurate there should be an entrance to the tunnel system somewhere nearby.",
  },
});

const farmer = buildNpc({
  roomId: 1,
  name: "Roquen",
  tags: ["roquen"],
  description: `appears to be a Paladin of some sort.  An Elf?`,
  inventory: [],
  messages: {
    default: `Aye?`,
    news: "'I dont speak common tongue.",
    name: "In another life, I had spaulders with swords on them",
  },
});

export const npcs = [guard, innkeeper, herbalist, farmer, cartographer].reduce(
  (acc, npc) => {
    acc[npc.name] = npc;
    return acc;
  },
  {}
);
