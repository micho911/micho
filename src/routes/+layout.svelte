<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import SunLight from '#lib/components/SunLight.svelte';
	import { external, site, socials } from '#lib/content.ts';

	let { children } = $props();

	const nav = [
		{ label: 'cv', href: '/cv' },
		{ label: 'projects', href: '/projects' }
	];
</script>

<SunLight />

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-4 focus:z-10 focus:bg-surface focus:px-3 focus:py-2"
>
	Skip to content
</a>

<div class="sky-tint pointer-events-none fixed inset-0" aria-hidden="true"></div>
<div class="lamp-glow pointer-events-none fixed inset-0 opacity-(--dark)" aria-hidden="true"></div>

<div class="relative mx-auto max-w-5xl px-4 sm:px-6">
	<header class="flex items-center justify-between py-5 font-mono text-sm text-muted print:hidden">
		<a href="/" class="hover:text-ink">{site.domain}</a>
		<nav aria-label="Primary" class="flex gap-4 sm:gap-6">
			{#each nav as item (item.href)}
				<a
					href={item.href}
					aria-current={page.url.pathname.startsWith(item.href) ? 'page' : undefined}
					class="hover:text-ink aria-[current=page]:text-ink"
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</header>

	<main id="main">
		{@render children()}
	</main>

	<footer class="mt-10 border-t border-line py-10 font-mono text-[13px] text-muted print:hidden">
		<div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
			<p>© {new Date().getFullYear()} {site.fullName}</p>
			<ul class="flex gap-5" aria-label="Elsewhere">
				{#each socials as link (link.label)}
					<li><a href={link.href} {...external(link.href)} class="hover:text-ink">{link.label}</a></li>
				{/each}
			</ul>
		</div>
		<p class="mt-4 max-w-[60ch]">
			Fun fact: I didn't type a single line of this site. A coding agent wrote all of it while I
			told it what I wanted and what looked off. I still check everything, especially the content,
			and the code is mine, I just didn't write it by hand. That's how things get built now.
		</p>
	</footer>
</div>
