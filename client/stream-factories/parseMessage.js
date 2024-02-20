import { Transform } from "stream";
import { safeParseJSON } from "../../utils/index.js";
import fs from "fs";

export const MessageStream = { parseMessageStream: null };

const state = { fromLastSeen: null };
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
        let color = "brightCyan";

        if (from === "Gods") {
          color = "magenta";
          from = "A voice out of the void";
        }
        if (from === "Help") color = "white";
        if (from === "Server") color = "brightBlue";
        if (from === "World") color = "green";
        if (from === "You") color = "white";

        let string;
        if (from === "World") string = `${data}`;
        else string = `${from}: ${data}`;

        const displayInput = buildDisplayInput({
          type,
          data: handleContext(string, from),
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

function handleContext(string, from) {
  let updatedString = string;
  const lastSeen = state.fromLastSeen;
  if (
    (from !== "Server" && lastSeen === "World" && from !== "World") ||
    (lastSeen !== "World" && from === "World")
  ) {
    updatedString = `\n${string}`;
  }
  if (from !== "Server") state.fromLastSeen = from;
  return updatedString;
}

function buildDisplayInput({ type, data, color }) {
  return { type, data, color };
}

// map art to file path and color
const artDict = {
  cleric: { path: "./assets/cleric.txt", color: "brightYellow" },
  ogre: { path: "./assets/ogre.txt", color: "green" },
  punch: { path: "./assets/punch.txt", color: "red" },
  moon: { path: "./assets/moon.txt", color: "brightWhite" },
  sun: { path: "./assets/sun.txt", color: "brightYellow" },
  storm: { path: "./assets/storm.txt", color: "brightBlue" },
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
