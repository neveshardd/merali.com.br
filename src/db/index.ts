
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Use Environment Variables for DB Connection
// For Vercel/Production with Turso: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
// For Local Dev: file:local.db
// Astro uses import.meta.env for env vars
const url = (import.meta.env.TURSO_DATABASE_URL) || 'file:local.db';
const authToken = import.meta.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema });

// Simple init for local/remote
// Ideally use drizzle-kit push or migrations
export const initDb = async () => {
    try {
        await client.execute(`
            CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            category TEXT NOT NULL,
            description TEXT,
            year TEXT,
            location TEXT,
            area TEXT,
            images TEXT DEFAULT '[]',
            featured INTEGER DEFAULT 0,
            created_at INTEGER DEFAULT (unixepoch())
            )
        `);
        console.log("Database initialized successfully.");
    } catch (e) {
        // Log error but don't crash the whole app if table exists or connection is read-only
        console.warn("DB Init Note:", e instanceof Error ? e.message : e);
    }
};

// Try to auto-initialize
initDb().catch(err => console.error("Auto-init failed:", err));
