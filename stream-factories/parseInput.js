import internal, { Transform } from "stream";
import { buildMessage } from "../utils/index.js";
import { MessageStream } from "./parseMessage.js";

export const parseInputBuilder = (label, ws) =>
  new Transform({
    transform(chunk, encoding, next) {
      const string = chunk.toString().trim();

      // commands
      if (string[0] === "/") {
        if (string === "/close") {
          ws.close();
        } else {
          console.log(`Unknown command: ${string.slice(1)}`);
        }
      }
      // send ascii art
      else if (string[0] === ":") {
        if (string === ":cleric") {
          this.push(buildMessage("ascii", "cleric"));
        } else if (string === ":ogre") {
          this.push(buildMessage("ascii", "ogre"));
        } else if (string === ":punch") {
          this.push(buildMessage("ascii", "punch"));
        } else if (string === ":volcano") {
          this.push(buildMessage("volcano", "assets/volcano.png"));
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
