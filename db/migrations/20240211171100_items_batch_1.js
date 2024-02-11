/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex("items").insert([
    {
      name: "canteen",
      description: "A canteen filled with water. It's heavy.",
    },
    { name: "key", description: "A small iron key." },
    { name: "mug", description: "A pewter mug. It's empty." },
    { name: "scepter", description: "A golden scepter with a red gem." },
    { name: "coin", description: "A silver coin." },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {};
