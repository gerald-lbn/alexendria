<script>
	import Logo from '$lib/components/logo.svelte';
</script>

<header class="container flex h-24 items-center justify-between">
	<Logo />
	<a
		href="#"
		class="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
	>
		Se connecter
	</a>
</header>

<main>
	<section class="container grid grid-cols-12 gap-4 py-20">
		<div class="col-span-6">
			<div class="bg-muted flex w-fit items-center rounded-full pr-4 font-medium">
				<span class="bg-foreground mr-3 rounded-full px-3 py-1 text-white">Nouveau</span>3 annales
				ajoutées depuis votre dernière visite
			</div>

			<h1 class="mt-5 text-5xl font-bold leading-tight tracking-tight">
				Moins de temps à chercher,<br /> plus pour réviser.
			</h1>

			<p class="text-muted-foreground mt-4 max-w-[600px] text-lg">
				Fini la galère pour trouver des annales et des corrections. Tout est centralisé pour réviser
				sans perdre une minute.
			</p>

			<div class="mt-7 flex gap-4">
				<a
					href="#"
					class="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-8 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				>
					Voir les annales
				</a>
				<a
					href="#"
					class="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-8 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				>
					Soumettre une annale
				</a>
			</div>
		</div>

		<div class="col-span-5"></div>
	</section>
</main>
