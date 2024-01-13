import { Transform } from "stream";
import { buildMessage } from "../../utils/index.js";
import { MessageStream } from "./parseMessage.js";

const directionMapper = {
  north: "north",
  n: "north",
  east: "east",
  e: "east",
  south: "south",
  s: "south",
  west: "west",
  w: "west",
  up: "up",
  u: "up",
  down: "down",
  d: "down",
};

const knownAsciiArt = ["cleric", "ogre", "punch"];
// give access to ws, stream, and internalStream with closure
const knownCommands = {
  close: {
    description: "Exit the game",
    usage: "/close",
    action: (ws) => ws.close(),
  },
  drop: {
    description: "Drop an item",
    usage: "/drop <item> <quantity?>, alias: d",
    action: (_, stream, internalStream, [itemName, quantity = 1]) => {
      stream.push(
        buildMessage("server_command", `drop ${itemName} ${quantity}`)
      );
    },
  },
  get: {
    description: "Pick up an item",
    usage: "/get <item> <quantity?>, alias: g",
    action: (_, stream, internalStream, [itemName, quantity = 1]) => {
      stream.push(
        buildMessage("server_command", `get ${itemName} ${quantity}`)
      );
    },
  },
  give: {
    description: "Give an item to another player",
    usage: "/give <player> <item> <quantity?>, alias: gv",
    action: (_, stream, internalStream, [player, itemName, quantity = 1]) => {
      stream.push(
        buildMessage("server_command", `give ${player} ${itemName} ${quantity}`)
      );
    },
  },
  help: {
    description: "List available commands",
    usage: "/help",
    action: (_, __, internalStream) => {
      const helpMessage =
        "\n" +
        Object.values(knownCommands)
          .map((command) => `${command.usage} - ${command.description}`)
          .join("\n");
      internalStream.write(buildMessage("text", helpMessage, "Help"));
    },
  },
  inventory: {
    description: "List your inventory",
    usage: "/inventory, alias: i",
    action: (_, stream) => {
      stream.push(buildMessage("server_command", "inventory"));
    },
  },
  look: {
    description: "Look around",
    usage: "/look",
    action: (_, stream) => stream.push(buildMessage("server_command", "look")),
  },
  move: {
    description: "Move in a direction",
    usage: "/move <direction>, alias: m",
    action: (_, stream, internalStream, [inputDirection]) => {
      const direction = directionMapper[inputDirection];
      if (!direction) {
        internalStream.write(
          buildMessage("text", "You must specify a direction to move.", "Error")
        );
      }
      stream.push(buildMessage("server_command", `move ${direction}`));
    },
  },
};

const commandMapper = {
  close: knownCommands.close,
  c: knownCommands.close,
  drop: knownCommands.drop,
  d: knownCommands.drop,
  get: knownCommands.get,
  g: knownCommands.get,
  give: knownCommands.give,
  gv: knownCommands.give,
  help: knownCommands.help,
  h: knownCommands.help,
  inventory: knownCommands.inventory,
  i: knownCommands.inventory,
  look: knownCommands.look,
  l: knownCommands.look,
  move: knownCommands.move,
  m: knownCommands.move,
};

export const parseInputBuilder = (label, ws) =>
  new Transform({
    transform(chunk, encoding, next) {
      const string = chunk.toString().trim();

      // commands
      if (string[0] === "/") {
        const [commandName, ...args] = string.slice(1).split(" ");
        const command = commandMapper[commandName];
        if (command) {
          command.action(ws, this, MessageStream.parseMessageStream, args);
        } else {
          console.log(`Unknown command: ${string.slice(1)}`);
        }
      }
      // send ascii art
      else if (string[0] === ":") {
        const art = string.slice(1);
        if (knownAsciiArt.includes(art)) {
          const outGoingMessage = buildMessage("ascii", art, label);
          this.push(outGoingMessage);
        } else {
          console.log(`Unknown ascii art: ${string.slice(1)}`);
        }
      }
      // send text
      else {
        const outGoingMessage = buildMessage("text", string, label);
        const internalMessage = buildMessage("text", string, "You");
        MessageStream.parseMessageStream.write(internalMessage);
        this.push(outGoingMessage);
      }
      next();
    },
  });
