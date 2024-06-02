import { Pool } from "pg";

const pool = new Pool({
  user: process.env.POSTGRES_USER ?? "postgres",
  host: process.env.POSTGRES_HOST ?? "localhost",
  database: process.env.POSTGRES_DATABASE ?? "postgres",
  password: process.env.POSTGRES_PASSWORD ?? "postgres",
  port: 5432,
});

export default pool;
