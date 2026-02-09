import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
	id: text('id').primaryKey(), // using generated uuids or cuid
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	category: text('category').notNull(),
	description: text('description').notNull(),
	year: text('year'),
	location: text('location'),
	area: text('area'),
	images: text('images').default('[]'), // Store as JSON string
    featured: integer('featured', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});
