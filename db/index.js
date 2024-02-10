import pg from "pg";

process.env.PGHOST = "localhost";
process.env.PGPASSWORD = "test";
process.env.PGPORT = "5433";
process.env.PGUSER = "postgres";

const client = new pg.Client();
// client.query("SELECT * FROM pg_catalog.pg_tables;").then(console.log);
const query = (text, params) => client.query(text, params);

export const dbClient = {
  ready: client.connect(),
  query,
  closeConnection: client.end,
};
