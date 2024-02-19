function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function buildNpc({ roomId, name, tags, description, messages }) {
  return {
    roomId,
    name,
    tags,
    description,
    messages,
  };
}

const npcOptions = [
  buildNpc({
    roomId: 99,
    name: "Lorcan",
    tags: ["wanderer", "lorcan", "traveler", "stories"],
    description: "A mysterious figure with a cloak draped loosely over their shoulders, carrying tales from distant lands.",
    messages: {
      default: "The road is long and full of stories. Care to share one, or shall I regale you with mine?",
    },
  }),
  buildNpc({
    roomId: 99,
    name: "Sorcha",
    tags: ["merchant", "sorcha", "trader", "goods"],
    description: "A savvy merchant with a cart full of intriguing goods, her eyes gleaming with the promise of a good bargain.",
    messages: {
      default: "Traveler! My wares are as varied as the stars. Care to take a look?",
      talk: "yeah you cant afford this stuff, take care.",
    },
  }),
  buildNpc({
    roomId: 99,
    name: "Eoghan",
    tags: ["bard", "eoghan", "music", "song"],
    description: "With a lute in hand and a song on his lips, Eoghan's melodies can turn even the dullest road into a lively journey.",
    messages: {
      default: "Ah, a fellow traveler! Let me share with you a melody to lighten your steps.",
      talk: "Eoghan remains silent, but begins shredding on his lute with a smirk.",
    },
  }),
  buildNpc({
    roomId: 99,
    name: "Cathy",
    tags: ["hag", "peddler", "weirdo", "dragon"],
    description: "a woman who appears otherwise 'common' smirks at you.",
    messages: {
      default: "Greetings, traveler. I sure love shiny things, don't you?",
      talk: "yeah I am exactly who and what you think I am.",
    },
  }),
  null, // maybe a ghost? lol sometimes nobody should be there imo
];

function encounterNpc() {
  const npc = getRandomElement(npcOptions);

  if (npc) {
    console.log(`You encounter ${npc.name}: ${npc.description}`);
    console.log(npc.messages.default);
  } else {
    console.log("The road is quiet and uneventful. You pass by without encountering anyone.");
  }
}
