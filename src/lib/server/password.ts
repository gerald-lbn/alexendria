import { hash, verify } from '@node-rs/argon2';
import { sha1 } from '@oslojs/crypto/sha1';
import { encodeHexLowerCase } from '@oslojs/encoding';

export const hashPassword = async (password: string) =>
	hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

export const verifyPassword = async (hash: string, password: string) => verify(hash, password);

/**
 * Check password strength using the Pwned Passwords API.
 * @param password The password to check.
 * @returns A boolean indicating whether the password is strong.
 */
export const checkPasswordStrength = async (password: string) => {
	if (password.length < 8) return false;

	const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
	const prefixHash = hash.slice(0, 5);
	const response = await fetch(`https://api.pwnedpasswords.com/range/${prefixHash}`);
	const data = await response.text();
	const items = data.split('\n');
	for (const item of items) {
		const hashSuffix = item.slice(0, 35).toLowerCase();
		if (hash === prefixHash + hashSuffix) {
			return false;
		}
	}
	return true;
};
