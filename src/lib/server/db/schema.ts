import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	fullname: varchar('fullname').notNull(),
	email: varchar('email').notNull().unique(),
	password: varchar('password').notNull(),
	registeredTOTP: boolean('registered_totp').notNull().default(false)
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade'
		}),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const totpKeys = pgTable('totp_keys', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id, {
			onDelete: 'cascade'
		})
		.notNull(),
	key: text('key').notNull()
});

// User relationships
export const userRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	totpKeys: many(totpKeys)
}));

// Session relationships
export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

// TOTP Key relationships
export const totpKeyRelations = relations(totpKeys, ({ one }) => ({
	user: one(users, {
		fields: [totpKeys.userId],
		references: [users.id]
	})
}));
