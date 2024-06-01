import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER ?? "postgres",
  host: "localhost",
  database: process.env.DB_NAME ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  port: 5432,
});

export default pool;
