import { Writable } from "stream";
import terminalPkg from "terminal-kit";

const { terminal } = terminalPkg;

terminal.windowTitle("Terminal Chat");

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
      } else if (type === "volcano") {
        terminal.drawImage(data, { shrink: { width: 100, height: 100 } });
      } else console.error(`Unknown display type: ${type}`);
      next();
    },
  });
