<script lang="ts">
	import Heading from '$lib/components/auth/heading.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<Heading
	heading="Configurer la double authentification"
	subheading="Pour une sécurité accrue, veuillez choisir une méthode d'authentification à deux facteurs."
/>

<ul class="space-y-2">
	<li>
		<Button href="/2fa/passkey/register" class="w-full">Utiliser une passkey</Button>
	</li>
	<li>
		<Button href="/2fa/totp/setup" variant="outline" class="w-full">
			Utiliser une application d'authentification
		</Button>
	</li>
</ul>
