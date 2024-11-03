import type { sessions, users } from './schema';

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
