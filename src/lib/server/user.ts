import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import type { User } from '$lib/server/db/types';
import { hashPassword } from '$lib/server/password';
import { eq } from 'drizzle-orm';

export const getUserByEmail = async (email: string) => {
	const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
	return user;
};

export const createUser = async (fullname: string, email: string, password: string) => {
	const hashedPassword = await hashPassword(password);

	return await db
		.insert(users)
		.values({
			fullname,
			email,
			password: hashedPassword
		})
		.returning();
};

export const markUserAsRegisteredTOTP = async (userId: User['id']) =>
	db
		.update(users)
		.set({
			registeredTOTP: true
		})
		.where(eq(users.id, userId))
		.returning();
