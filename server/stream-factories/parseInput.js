import { Writable } from "stream";
import { buildMessage } from "../../utils/index.js";
import { MessageStream } from "./parseMessage.js";
import { clientsWritable } from "../clients.js";

// world states with art label and description
const knownStates = {
  moon: {
    art: "moon",
    description: "A lonely moon rise high in the sky.",
  },
  storm: {
    art: "storm",
    description:
      "A deafening crack of thunder breaks the air. The wind howls as rain pours from the heavens.",
  },
  sun: {
    art: "sun",
    description: "The sun shines brightly overhead.",
  },
};
const knownCommands = {
  close: {
    description: "Shtudown the game server",
    usage: "/close",
    action: (wsServer) => {
      console.log("Shutting down server..");
      wsServer.close(() => process.exit());
      console.log("Closing connections..");
      wsServer.clients.forEach((client) => client.close());
    },
  },
  help: {
    description: "List available commands",
    usage: "/help",
    action: () => {
      const helpMessage =
        "Help:\n" +
        Object.values(knownCommands)
          .map((command) => `${command.usage} - ${command.description}`)
          .join("\n");
      console.log(helpMessage);
    },
  },
};

export const parseInputBuilder = (wsServer) =>
  new Writable({
    write(chunk, encoding, next) {
      const string = chunk.toString().trim();

      // commands
      if (string[0] === "/") {
        const command = knownCommands[string.slice(1)];
        if (command) {
          command.action(wsServer);
        } else {
          console.log(`Unknown command: ${string.slice(1)}`);
        }
      }
      // send world status
      else if (string[0] === ":") {
        const art = string.slice(1);
        const state = knownStates[art];
        if (state) {
          const outGoingMessage = buildMessage(
            "text",
            state.description,
            "World"
          );
          const outGoingArt = buildMessage("ascii", state.art, "World");

          clientsWritable.write(outGoingMessage);
          clientsWritable.write(outGoingArt);
        } else {
          console.log(`Unknown ascii art: ${string.slice(1)}`);
        }
      }
      // send text
      else {
        const outGoingMessage = buildMessage("text", string, "Gods");
        clientsWritable.write(outGoingMessage);
      }
      next();
    },
  });
