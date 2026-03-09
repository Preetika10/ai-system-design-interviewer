import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "user_db",
  password: "preetika",
  port: 5432,
});

export default pool;