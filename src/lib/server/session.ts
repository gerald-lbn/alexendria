import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import type { User, Session } from '$lib/server/db/types';

import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import type { Cookies } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const generateSessionToken = () => {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
};

export const createSession = async (token: string, userId: User['id']) => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
	};
	await db.insert(sessions).values(session);
	return session;
};

export const validateSessionToken = async (token: string): Promise<SessionValidationResult> => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db.query.sessions.findFirst({
		where: eq(sessions.id, sessionId),
		with: {
			user: true
		}
	});

	if (!result) {
		return { session: null, user: null };
	}

	const { user, ...session } = result;

	// If the session has expired, delete it and return null
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		return { session: null, user: null };
	}

	// If the session is within 15 days of expiring, extend it by 30 days
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(sessions)
			.set({
				expiresAt: session.expiresAt
			})
			.where(eq(sessions.id, session.id));
	}

	return { session, user };
};

export const invalidateSession = async (sessionId: string) => {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
};

export function setSessionTokenCookie(cookies: Cookies, token: string, expiresAt: Date) {
	cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(cookies: Cookies) {
	cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
