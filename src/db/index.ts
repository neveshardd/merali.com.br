import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'sqlite.db');
const url = `file:${dbPath}`;
console.log('Final Database URL resolved to:', url);
const client = createClient({ url });

export const db = drizzle(client, { schema });

// Initialize DB safely
export const initDb = async () => {
    // Skip if we think we are on Vercel/Production
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        console.log("Skipping DB init on Vercel/Production");
        return;
    }

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
        console.warn("DB Init failed (expected if read-only):", e);
    }
};

initDb().catch(e => console.error("Init error ignored:", e));
