
import { db } from './index';
import { projects } from './schema';
import { eq, desc } from 'drizzle-orm';

export const getProjects = async () => {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
};

export const getProjectBySlug = async (slug: string) => {
    const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
    return result[0];
};

export const createProject = async (data: typeof projects.$inferInsert) => {
    try {
        await db.insert(projects).values(data).returning();
    } catch (e) {
        console.error('Create error:', e);
        throw e;
    }
};

export const deleteProject = async (id: string) => {
    await db.delete(projects).where(eq(projects.id, id));
};

export const getProjectById = async (id: string) => {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
};


export const updateProject = async (id: string, data: Partial<typeof projects.$inferInsert>) => {
    await db.update(projects).set(data).where(eq(projects.id, id));
};

export const seedInitialProjects = async () => {
    // No-op: Removed mocks as requested.
    return;
};
