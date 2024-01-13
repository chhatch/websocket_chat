const buildNpc = ({ roomId, name, description, inventory, messages }) => ({
  tags: [],
  roomId,
  name,
  tags: [],
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
    default: "I'm on duty. I can't talk right now.",
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
  },
});

const farmer = buildNpc({
  roomId: 2,
  name: "Bran Fieldstead",
  tags: ["farmer", "bran", "fieldstead"],
  description: `A gruff looking farmer with a pitchfork slung over his shoulder.
    It's hard to tell if he's angry or just tired. His boots are caked with black mud.`,
  inventory: [],
  messages: {
    default: `What do you want? I've got a lot to do.`,
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
I waited many years to explore this town.`,
  },
});

export const npcs = [guard, innkeeper, herbalist, farmer, cartographer].reduce(
  (acc, npc) => {
    acc[npc.name] = npc;
    return acc;
  },
  {}
);
