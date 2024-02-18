import { Transform } from "stream";
import { safeParseJSON } from "../../utils/index.js";
import fs from "fs";
import { colors } from './colors.js';

export const MessageStream = { parseMessageStream: null };

export const parseMessageBuilder = (label) =>
  new Transform({
    objectMode: true,
    transform(chunk, encoding, next) {
      let type,
        data,
        from = "Received";
      ({ type, data, from } = safeParseJSON(chunk.toString().trim()));

      // handle text
      if (type === "text") {
        let color = colors.aqua;

        if (from === "Gods") {
          color = colors.magenta;
          from = "A voice out of the void";
        }
        if (from === "Help") color = colors.white;
        if (from === "Server") color = colors.lavender;
        if (from === "World") color = colors.green;
        if (from === "You") color = colors.white;

        let string;
        if (from === "World") string = `${data}\n`;
        else string = `${from}: ${data}\n`;

        const displayInput = buildDisplayInput({
          type,
          data: string,
          color,
        });

        this.push(displayInput);
      }
      // handle ascii art
      else if (type === "ascii") {
        const art = artDict[data];
        if (art) {
          const string = fs.readFileSync(art.path, "utf8");
          const displayInput = buildDisplayInput({
            type,
            data: string,
            color: art.color,
          });
          this.push(displayInput);
        } else {
          console.log(`Unknown ascii art: ${string.slice(1)}`);
        }
      } else if (type === "volcano") {
        const displayInput = buildDisplayInput({
          type,
          data,
        });
        this.push(displayInput);
      } else console.error(`Unknown message type: ${type}`);

      next();
    },
  });

function buildDisplayInput({ type, data, color }) {
  return { type, data, color };
}

// map art to file path and color
const artDict = {
  cleric: { path: "./assets/cleric.txt", color: colors.yellow },
  ogre: { path: "./assets/ogre.txt", color: colors.green },
  punch: { path: "./assets/punch.txt", color: colors.red },
  moon: { path: "./assets/moon.txt", color: colors.White },
  sun: { path: "./assets/sun.txt", color: colors.Yellow },
  storm: { path: "./assets/storm.txt", color: colors.aqua },
};

function getCleric() {
  return fs.readFileSync("./assets/cleric.txt", "utf8");
}

function getOgre() {
  return fs.readFileSync("./assets/ogre.txt", "utf8");
}

function getPunch() {
  return fs.readFileSync("./assets/punch.txt", "utf8");
}
