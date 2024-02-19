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

const blacksmith = buildNpc({
  roomId: '99',
  name: 'Ivan Steelhand',
  tags: ['blacksmith', 'craftsman', 'vampire', 'merchant'],
  description: 'Ivan, with his burly frame and eyes that seem to pierce the darkness, works only under the cover of night. His forge, cold by day, comes alive with an otherworldly glow at dusk. The swords he crafts are whispered to be quenched in a liquid far darker than water.',
  inventory: ['Masterwork Sword', 'Blood-tempered Dagger', 'Leather Apron'],
  messages: {
    default: "Ah, the night brings out the true edge in steel. What can I forge for you in the moon's embrace?", 
    talk: "Careful with that blade. It's thirstier than most.",
  },
});

const healer = buildNpc({
  roomId: '99',
  name: 'Maybelline Kaspersky',
  tags: ['herbalist', 'healer', 'vampire', 'mystic'],
  description: 'Marta, with her pale skin almost glowing under the moonlight, tends to her garden of nocturnal blooms. Her potions, imbued with the essence of the night, offer remedies that border on the arcane, with whispers of immortality among their rumored effects.',
  inventory: ['Healing Potion', 'Nightshade', 'Tome of Blood Magic'],
  messages: {
    default: "The forest at night holds the truest herbs, steeped in the essence of the moon. What potion do you desire?",
    potion: "This elixir? It's for those who wish to walk the night unburdened by time.",
  },
});

const bard = buildNpc({
  roomId: '99',
  name: 'Silas Lucason',
  tags: ['bard', 'storyteller', 'vampire', 'traveler'],
  description: "Silas, whose tales are as timeless as his unchanged appearance, serenades only under the silver glow of the moon. His shadow dances unnaturally as he performs, and some swear that his reflection is nowhere to be seen in the tavern’s mirrors.",
  inventory: ['Lute', 'Collection of Ageless Ballads', 'Silver Mirror'],
  messages: {
    'Join me in a nocturne, for the day is too bright for stories deep and true.',
    'Ever notice how the moonlight gives life to the shadows? Much like a good story, or... a new beginning.',
  },
});

export const npcs = [blacksmith, healer, bard].reduce(
  (acc, npc) => {
    acc[npc.name] = npc;
    return acc;
  },
  {}
);
