const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "system_design_ai",
  password: "password",
  port: 5432,
});

module.exports = pool;