import { Transform } from "stream";
import { buildMessage } from "../../utils/index.js";
import { MessageStream } from "./parseMessage.js";

const knownAsciiArt = ["cleric", "ogre", "punch"];
const knownCommands = {
  close: {
    description: "Exit the game",
    usage: "/close",
    action: (ws) => ws.close(),
  },
  look: {
    description: "Look around",
    usage: "/look",
    action: (_, stream) => stream.push(buildMessage("server_command", "look")),
  },
};

export const parseInputBuilder = (label, ws) =>
  new Transform({
    transform(chunk, encoding, next) {
      const string = chunk.toString().trim();

      // commands
      if (string[0] === "/") {
        const command = knownCommands[string.slice(1)];
        if (command) {
          command.action(ws, this);
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
