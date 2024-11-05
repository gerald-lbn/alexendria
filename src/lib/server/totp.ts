import { db } from '$lib/server/db';
import { totpKeys } from '$lib/server/db/schema';
import { encrypt } from '$lib/server/encryption';
import { ExpiringTokenBucket } from '$lib/server/rate-limit';
import type { User } from '$lib/server/db/types';
import { eq } from 'drizzle-orm';

export const totpBucket = new ExpiringTokenBucket<number>(5, 60 * 30);

export const updateUserTOTPKey = async (userId: User['id'], key: Uint8Array) => {
	const encryptedKey = Buffer.from(encrypt(key));

	// Check if the user already has a TOTP key
	const existingKey = await db.query.totpKeys.findFirst({
		where: eq(totpKeys.userId, userId)
	});
	if (existingKey) {
		await db.delete(totpKeys).where(eq(totpKeys.userId, userId));
	}

	// Insert the new key
	await db.insert(totpKeys).values({
		userId,
		key: encryptedKey.toString('hex')
	});
};
