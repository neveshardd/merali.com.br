
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import 'dotenv/config'; // Ensure env vars are loaded

// Use Environment Variables for DB Connection
// For Vercel/Production with Turso: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
// For Local Dev: file:local.db
const url = process.env.TURSO_DATABASE_URL || 'file:local.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

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
    } catch (e) {
        console.error("Error initializing DB table:", e);
    }
};
