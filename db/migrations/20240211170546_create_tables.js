/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const up = function (knex) {
  const itemsPromise = knex.schema.createTable("items", (table) => {
    table.increments("id");
    table.string("name");
    table.string("description");
  });

  const roomsPromise = knex.schema.createTable("rooms", (table) => {
    table.increments("id");
    table.string("description", 1000);
    table.jsonb("exits");
    table.jsonb("items");
    table.string("name");
  });

  return Promise.all([itemsPromise, roomsPromise]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {};
