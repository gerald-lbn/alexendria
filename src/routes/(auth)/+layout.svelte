<script lang="ts">
	const { children } = $props();
</script>

<div class="mx-auto flex h-svh max-w-sm flex-col justify-center space-y-6 p-4">
	{@render children()}
</div>
