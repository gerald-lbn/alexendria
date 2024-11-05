import { verifyPassword } from '$lib/server/password';
import { RefillingTokenBucket, Throttler } from '$lib/server/rate-limit';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session.js';
import { getUserByEmail } from '$lib/server/user';
import loginSchema from '$lib/server/validation/login.js';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';

export const load = ({ locals }) => {
	if (locals.session !== null && locals.user !== null) {
		if (!locals.user.registeredTOTP) {
			throw redirect(302, '/2fa/setup');
		}
		throw redirect(302, '/');
	}
};

const throttler = new Throttler<number>([0, 1, 2, 4, 8, 16, 30, 60, 180, 300]);
const ipBucket = new RefillingTokenBucket<string>(20, 1);

const login = async ({ cookies, getClientAddress, request }: RequestEvent) => {
	// Check if the client has exceeded the rate limit
	const clientIP = getClientAddress();
	if (!clientIP && !ipBucket.check(clientIP, 1))
		return fail(429, {
			message: 'Too many requests'
		});

	// Get form data
	const formData = await request.formData();
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();

	// Validate form data
	const validForm = loginSchema.safeParse({ email, password });
	if (!validForm.success) {
		return fail(400, {
			errors: validForm.error.flatten().fieldErrors
		});
	}

	// Check if a user with this email exists
	const existingUser = await getUserByEmail(validForm.data.email);
	if (!existingUser) {
		return fail(400, {
			errors: {
				email: 'Identifiants incorrects',
				password: null
			}
		});
	}

	if (!ipBucket.consume(clientIP, 1))
		return fail(429, {
			message: 'Too many requests'
		});

	if (!throttler.consume(existingUser.id)) {
		return fail(429, {
			message: 'Too many requests',
			email: ''
		});
	}

	// Check if the password is correct
	const validPassword = await verifyPassword(existingUser.password, validForm.data.password);
	if (!validPassword)
		return fail(400, {
			errors: {
				email: 'Identifiants incorrects',
				password: null
			}
		});

	// Reset the rate limit for this user
	throttler.reset(existingUser.id);

	// Create a new session
	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, existingUser.id);
	setSessionTokenCookie(cookies, sessionToken, session.expiresAt);

	// Check if the user has 2FA enabled
	if (!existingUser.registeredTOTP) {
		throw redirect(302, '/2fa/setup');
	}

	throw redirect(302, '/admin');
};

export const actions = {
	default: login
};
