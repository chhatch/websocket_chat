import { Writable } from "stream";
import terminalPkg from "terminal-kit";

const { terminal } = terminalPkg;

export const displayBuilder = () =>
  new Writable({
    objectMode: true,
    write({ type, data, color }, encoding, next) {
      if (type === "text") {
        terminal.slowTyping(data, { style: terminal[color], delay: 75 });
      } else if (type === "label") {
        terminal[color](data);
      } else if (type === "ascii") {
        terminal.bold[color](data);
      } else console.error(`Unknown display type: ${type}`);
      next();
    },
  });
