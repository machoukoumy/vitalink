import { Pool } from "pg";

const globalForDb = globalThis as unknown as { pool: Pool };

const DATABASE_URL = process.env.DATABASE_URL || "";

if (!globalForDb.pool) {
  globalForDb.pool = new Pool({
    connectionString: DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: DATABASE_URL.includes("supabase") ? { rejectUnauthorized: false } : undefined,
  });
}

export const pool = globalForDb.pool;

export async function query(text: string, params?: unknown[]) {
  const res = await pool.query(text, params);
  return res.rows;
}

export async function queryOne(text: string, params?: unknown[]) {
  const rows = await query(text, params);
  return rows[0] || null;
}
