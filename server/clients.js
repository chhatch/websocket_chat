import { Writable } from "stream";

export const clientsConnected = {};

export const clientsWritable = new Writable({
  write(chunk, encoding, next) {
    Object.values(clientsConnected).forEach((client) => {
      client.writeStream.write(chunk);
    });
    next();
  },
});
