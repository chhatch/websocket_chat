import { dbClient } from "../db/index.js";

export const items = {};

export const itemsReady = dbClient
  .select("*")
  .from("items")
  .then((rows) => {
    rows.reduce((acc, item) => {
      acc[item.id] = item;
      acc[item.name] = item;
      return acc;
    }, items);
  })
  .catch(console.error);
