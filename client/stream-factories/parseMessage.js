import { Transform } from "stream";
import { safeParseJSON } from "../../utils/index.js";
import fs from "fs";

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
        let color = "brightCyan";

        if (from === "Gods") {
          color = "magenta";
          from = "A voice out of the void";
        }
        if (from === "Server") color = "brightBlue";
        if (from === "World") color = "green";
        if (from === "You") color = "white";

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

function getCleric() {
  return fs.readFileSync("./assets/cleric.txt", "utf8");
}

function getOgre() {
  return fs.readFileSync("./assets/ogre.txt", "utf8");
}

function getPunch() {
  return fs.readFileSync("./assets/punch.txt", "utf8");
}
