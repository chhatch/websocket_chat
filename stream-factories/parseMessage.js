import { Transform } from "stream";
import { safeParseJSON } from "../utils/index.js";
import fs from "fs";

export const parseMessageBuilder = (label) =>
  new Transform({
    objectMode: true,
    transform(chunk, encoding, next) {
      const {
        type,
        data,
        from = Received,
      } = safeParseJSON(chunk.toString().trim());

      // handle text
      if (type === "text") {
        let color = "brightCyan";

        if (from === "Server") color = "brightBlue";

        const displayFromInput = buildDisplayInput({
          type: "label",
          data: `${from}: `,
          color,
        });

        const string = `${data}\n`;
        const displayInput = buildDisplayInput({
          type,
          data: string,
          color,
        });

        this.push(displayFromInput);
        this.push(displayInput);
      }
      // handle ascii art
      else if (type === "ascii") {
        if (data === "cleric") {
          const art = `\n${getCleric()}\n\n`;
          const displayInput = buildDisplayInput({
            type,
            data: art,
            color: "brightYellow",
          });
          this.push(displayInput);
        } else if (data === "ogre") {
          const art = `\n${getOgre()}\n\n`;
          const displayInput = buildDisplayInput({
            type,
            data: art,
            color: "green",
          });
          this.push(displayInput);
        } else if (data === "punch") {
          const art = `\n${getPunch()}\n\n`;
          const displayInput = buildDisplayInput({
            type,
            data: art,
            color: "red",
          });
          this.push(displayInput);
        } else {
          console.log(`Unknown ascii art: ${string.slice(1)}`);
        }
      } else console.error(`Unknown message type: ${type}`);

      next();
    },
  });

function buildDisplayInput({ type, data, color }) {
  return { type, data, color };
}

function getCleric() {
  return fs.readFileSync("./ascii-art/cleric.txt", "utf8");
}

function getOgre() {
  return fs.readFileSync("./ascii-art/ogre.txt", "utf8");
}

function getPunch() {
  return fs.readFileSync("./ascii-art/punch.txt", "utf8");
}
