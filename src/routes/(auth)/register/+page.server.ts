import { checkPasswordStrength } from '$lib/server/password';
import { RefillingTokenBucket } from '$lib/server/rate-limit';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';
import { createUser, getUserByEmail } from '$lib/server/user';
import registerSchema from '$lib/server/validation/register';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';

const bucket = new RefillingTokenBucket<string>(3, 10);

export const load = ({ locals }) => {
	// Check if user is already logged in
	if (locals.session && locals.user) {
		// Check if the user has TOTP enabled
		if (!locals.user.registeredTOTP) {
			throw redirect(302, '/2fa/setup');
		}

		throw redirect(302, '/admin');
	}
};

const register = async ({ cookies, getClientAddress, request }: RequestEvent) => {
	// Check if the client has exceeded the rate limit
	const clientIP = getClientAddress();
	if (!clientIP && !bucket.check(clientIP, 1))
		return fail(429, {
			message: 'Too many requests'
		});

	// Get form data
	const formData = await request.formData();
	const fullname = formData.get('fullname')?.toString();
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();

	// Validate form data
	const validForm = registerSchema.safeParse({ fullname, email, password });
	if (!validForm.success) {
		return fail(400, {
			errors: validForm.error.flatten().fieldErrors
		});
	}

	// Check if a user with the same email already exists
	const existingUser = await getUserByEmail(validForm.data.email);
	if (existingUser) {
		return fail(400, {
			errors: {
				fullname: null,
				email: 'Un utilisateur avec cet email existe déjà',
				password: null
			}
		});
	}

	// Check if the password is strong enough
	const strongPassword = await checkPasswordStrength(validForm.data.password);
	if (!strongPassword) {
		return fail(400, {
			errors: {
				fullname: null,
				email: null,
				password: 'Le mot de passe est trop faible'
			}
		});
	}

	// Check if the client has exceeded the rate limit
	if (!clientIP && !bucket.consume(clientIP, 1)) {
		return fail(429, {
			message: 'Too many requests'
		});
	}

	// Create a new user
	const [user] = await createUser(
		validForm.data.fullname,
		validForm.data.email,
		validForm.data.password
	);

	// Create a new session
	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(cookies, sessionToken, session.expiresAt);

	// Redirect to the 2FA page
	throw redirect(302, '/2fa/setup');
};

export const actions = {
	default: register
};
