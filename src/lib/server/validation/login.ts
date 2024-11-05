import { users } from '$lib/server/db/schema';
import { createSelectSchema } from 'drizzle-zod';

const loginSchema = createSelectSchema(users, {
	email: (schema) =>
		schema.email.email({
			message: 'Adresse email invalide'
		}),
	password: (schema) =>
		schema.password.trim().min(1, {
			message: 'Mot de passe requis'
		})
}).pick({
	email: true,
	password: true
});

export default loginSchema;
