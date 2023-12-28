import { Transform } from "stream";

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
        } else {
          console.log(`Unknown ascii art: ${string.slice(1)}`);
        }
      }
      // send text
      else this.push(buildMessage("text", string));
      next();
    },
  });

function buildMessage(type, data) {
  return JSON.stringify({ type, data });
}
