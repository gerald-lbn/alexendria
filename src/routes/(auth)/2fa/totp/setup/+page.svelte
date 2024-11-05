<script lang="ts">
	import { enhance } from '$app/forms';
	import Heading from '$lib/components/auth/heading.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { SubmitFunction } from '@sveltejs/kit';

	const { data, form } = $props();

	let processing = $state(false);
	const submit2FACode: SubmitFunction = () => {
		processing = true;
		return async ({ update }) => {
			processing = false;
			await update();
		};
	};
</script>

<Heading
	heading="Configurer l'application d'authentification"
	subheading="Scannez le code QR ci-dessous avec votre application d'authentification pour configurer la double authentification."
/>

{@html data.qrCode}

<form method="post" use:enhance={submit2FACode} class="grid space-y-4">
	<Input name="key" value={data.encodedTOTPKey} hidden required class="hidden" />

	<div class="grid gap-1">
		<Label for="key">Vérifiez le code de l'application</Label>
		<Input name="code" required />
		{#if form?.message}
			<p class="text-sm text-destructive">{form.message}</p>
		{/if}
	</div>

	<Button type="submit" disabled={processing}>
		{processing ? 'Vérification en cours...' : 'Vérifier'}
	</Button>
</form>
