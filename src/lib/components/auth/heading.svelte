<script lang="ts">
	interface Props {
		heading: string;
		subheading?: string;
	}

	const { heading, subheading }: Props = $props();
</script>

<div class="flex flex-col space-y-1">
	<h1 class="text-2xl font-semibold tracking-tight">{heading}</h1>
	{#if subheading}
		<p class="text-muted-foreground text-sm">{subheading}</p>
	{/if}
</div>
