import knex from "knex";

export const dbClient = new knex({
  client: "pg",
  connection: {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    database: "postgres",
  },
});
