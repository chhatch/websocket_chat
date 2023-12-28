import { Transform } from "stream";

export const parseMessageBuilder = (label) =>
  new Transform({
    transform(chunk, encoding, next) {
      const string = chunk.toString();
      this.push(`${label} received: ${string}`);
      next();
    },
  });
