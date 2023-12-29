import { Transform } from "stream";
import { safeParseJSON } from "./utils/index.js";
import fs from "fs";

export const parseMessageBuilder = (label) =>
  new Transform({
    transform(chunk, encoding, next) {
      const { type, data, from } = safeParseJSON(chunk.toString().trim());

      // handle text
      if (type === "text") {
        this.push(`${from || "Received"}: ${data}\n`);
      }
      // handle ascii art
      else if (type === "ascii") {
        if (data === "cleric") {
          this.push(`\n${getCleric()}\n\n`);
        } else if (data === "ogre") {
          this.push(`\n${getOgre()}\n\n`);
        } else {
          console.log(`Unknown ascii art: ${string.slice(1)}`);
        }
      } else console.error(`Unknown message type: ${type}`);

      next();
    },
  });

function getCleric() {
  return fs.readFileSync("./ascii-art/cleric.txt", "utf8");
}

function getOgre() {
  return fs.readFileSync("./ascii-art/ogre.txt", "utf8");
}
