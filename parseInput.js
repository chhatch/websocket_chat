import { Transform } from "stream";

export const parseInputBuilder = (label, ws) =>
  new Transform({
    transform(chunk, encoding, next) {
      const string = chunk.toString().trim();
      if (string[0] === ":") {
        if (string === ":close") {
          ws.close();
        }
      } else this.push(chunk);
      next();
    },
  });
