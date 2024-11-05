import { z } from 'zod';

export const totpSchema = z.object({
	key: z.string().length(28, {
		message: 'La clé TOTP est invalide'
	}),
	code: z.string().min(1, {
		message: 'Le code TOTP est requis'
	})
});
