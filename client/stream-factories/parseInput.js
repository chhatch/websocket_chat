import { Transform } from "stream";
import { buildMessage } from "../../utils/index.js";
import { MessageStream } from "./parseMessage.js";

const knownAsciiArt = ["cleric", "ogre", "punch"];
// give access to ws, stream, and internalStream with closure
const knownCommands = {
  close: {
    description: "Exit the game",
    usage: "/close",
    action: (ws) => ws.close(),
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
  look: {
    description: "Look around",
    usage: "/look",
    action: (_, stream) => stream.push(buildMessage("server_command", "look")),
  },
  move: {
    description: "Move in a direction",
    usage: "/move <direction>",
    action: (_, stream, internalStream, [direction]) => {
      if (!direction) {
        internalStream.write(
          buildMessage("text", "You must specify a direction to move.", "Error")
        );
      }
      stream.push(buildMessage("server_command", `move ${direction}`));
    },
  },
};

export const parseInputBuilder = (label, ws) =>
  new Transform({
    transform(chunk, encoding, next) {
      const string = chunk.toString().trim();

      // commands
      if (string[0] === "/") {
        const [commandName, ...args] = string.slice(1).split(" ");
        const command = knownCommands[commandName];
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
