import dotenv from "dotenv";
dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  client: "pg",
  connection: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  },
};
