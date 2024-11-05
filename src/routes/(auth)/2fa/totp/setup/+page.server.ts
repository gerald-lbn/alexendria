import { totpBucket, updateUserTOTPKey } from '$lib/server/totp';
import { markUserAsRegisteredTOTP } from '$lib/server/user';
import { totpSchema } from '$lib/server/validation/totp';
import { createTOTPKeyURI, verifyTOTP } from '@oslojs/otp';
import { decodeBase64, encodeBase64 } from '@oslojs/encoding';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { renderSVG } from 'uqr';

export const load = ({ locals }) => {
	// Check if user is already logged in
	if (!locals.session || !locals.user) throw redirect(302, '/login');

	const totpKey = new Uint8Array(20);
	crypto.getRandomValues(totpKey);
	const encodedTOTPKey = encodeBase64(totpKey);
	const keyURI = createTOTPKeyURI('Alexendria-IUT', locals.user.fullname, totpKey, 30, 6);
	const qrCode = renderSVG(keyURI);

	return {
		encodedTOTPKey,
		qrCode
	};
};

const registerTOTP = async ({ locals, request }: RequestEvent) => {
	// Check if user is already logged in
	if (!locals.session || !locals.user)
		return fail(401, {
			message: 'Non authentifié'
		});

	// Check if user has already setup TOTP
	if (locals.user.registeredTOTP)
		return fail(403, { message: 'Vous avez déjà configuré la double authentification' });

	// Check if the user is rate limited
	if (!totpBucket.check(locals.user.id, 1)) return fail(429, { message: 'Trop de tentatives' });

	// Get the key and code from the form
	const formData = await request.formData();
	const encodedKey = formData.get('key');
	const code = formData.get('code');

	// Validate the formdata
	const validForm = totpSchema.safeParse({
		key: encodedKey,
		code
	});
	if (!validForm.success) return fail(400, { message: 'Données invalides' });

	// Decode the key
	let key: Uint8Array;
	try {
		key = decodeBase64(validForm.data.key);
	} catch {
		return fail(400, { message: 'Clé invalide' });
	}

	// Rate limit the user
	if (!totpBucket.consume(locals.user.id, 1)) return fail(429, { message: 'Trop de tentatives' });

	// Verify the code
	if (!verifyTOTP(key, 30, 6, validForm.data.code)) return fail(400, { message: 'Code invalide' });

	// Update the user totp key
	await updateUserTOTPKey(locals.user.id, key);

	// Set the user as 2fa registered
	await markUserAsRegisteredTOTP(locals.user.id);

	throw redirect(302, '/');
};

export const actions = {
	default: registerTOTP
};
