<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';

	import Heading from '$lib/components/auth/heading.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { enhance } from '$app/forms';

	const { form } = $props();

	let processing = $state(false);

	const submit: SubmitFunction = () => {
		processing = true;
		return async ({ update }) => {
			processing = false;
			await update();
		};
	};
</script>

<Heading heading="Créer un compte" subheading="Créez un compte pour continuer" />

<form method="post" class="grid space-y-4" use:enhance={submit}>
	<div class="grid gap-1">
		<Label for="fullname">Nom complet</Label>
		<Input required type="text" id="fullname" name="fullname" placeholder="John Doe" />
		{#if form?.errors?.fullname}
			<p class="text-sm text-destructive">{form.errors.fullname}</p>
		{/if}
	</div>

	<div class="grid gap-1">
		<Label for="email">Email</Label>
		<Input required type="email" id="email" name="email" placeholder="john.doe@company.com" />
		{#if form?.errors?.email}
			<p class="text-sm text-destructive">{form.errors.email}</p>
		{/if}
	</div>

	<div class="grid gap-1">
		<Label for="password">Mot de passe</Label>
		<Input
			required
			type="password"
			id="password"
			name="password"
			placeholder="••••••••"
			minlength={8}
		/>
		{#if form?.errors?.password}
			<p class="text-sm text-destructive">{form.errors.password}</p>
		{/if}
	</div>

	<Button type="submit" disabled={processing}>
		{#if processing}
			Chargement...
		{:else}
			Créer un compte
		{/if}
	</Button>
</form>

<p class="text-center text-sm text-muted-foreground">
	Déjà un compte? <Button href="/login" variant="link" class="p-0 underline">Se connecter</Button>
</p>
