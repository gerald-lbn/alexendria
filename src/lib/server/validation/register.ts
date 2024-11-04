import { users } from '$lib/server/db/schema';
import { createInsertSchema } from 'drizzle-zod';

const registerSchema = createInsertSchema(users, {
	fullname: (schema) =>
		schema.fullname.trim().min(2, {
			message: 'Le nom doit contenir au moins 2 caractères'
		}),
	email: (schema) =>
		schema.email.email({
			message: 'Adresse email invalide'
		}),
	password: (schema) =>
		schema.password.trim().min(8, {
			message: 'Le mot de passe doit contenir au moins 8 caractères'
		})
});

export default registerSchema;
