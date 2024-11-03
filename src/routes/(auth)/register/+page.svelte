<script lang="ts">
	import Heading from '$lib/components/auth/heading.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
</script>

<div class="mx-auto flex h-svh max-w-sm flex-col justify-center space-y-6 p-4">
	<Heading heading="Register" subheading="Create an account to get started" />

	<form action="" class="grid space-y-4">
		<div class="grid gap-2">
			<Label for="fullname">Nom complet</Label>
			<Input required type="text" id="fullname" name="fullname" placeholder="John Doe" />
		</div>

		<div class="grid gap-2">
			<Label for="email">Email</Label>
			<Input required type="email" id="email" name="email" placeholder="john.doe@company.com" />
		</div>

		<div class="grid gap-2">
			<Label for="password">Password</Label>
			<Input
				required
				type="password"
				id="password"
				name="password"
				placeholder="••••••••"
				minlength={8}
			/>
		</div>

		<Button type="submit">Register</Button>
	</form>

	<p class="text-muted-foreground text-center text-sm">
		Already have an account? <Button href="/login" variant="link" class="p-0 underline">
			Login
		</Button>
	</p>
</div>
