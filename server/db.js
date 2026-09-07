const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL;

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
    })
  : new Pool({
      host: process.env.PGHOST || "localhost",
      port: Number(process.env.PGPORT) || 5432,
      database:
        process.env.PGDATABASE || "taskflow",
      user:
        process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD,
    });

module.exports = pool;