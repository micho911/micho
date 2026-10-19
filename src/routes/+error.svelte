<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} · micho.tech</title>
</svelte:head>

<section class="pt-[9vh] pb-[6vh]">
	<h1
		class="font-serif text-[clamp(88px,21vw,240px)] leading-[0.9] font-extrabold tracking-[-0.045em] [text-shadow:6px_8px_0_rgb(var(--shadow)/.12)]"
	>
		{page.status}
	</h1>
	<p class="mt-7 text-[clamp(19px,2.4vw,24px)]">
		Nothing casts a shadow here. <a href="/" class="underline">Head back to the hub.</a>
	</p>
</section>
