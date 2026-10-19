<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import { now, projects, site } from '#lib/content.ts';

	const teaser = projects.slice(0, 4);
	const door =
		'group flex flex-col rounded-3xl border border-line bg-surface p-6 shadow-sun transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-muted sm:p-8';
</script>

<svelte:head>
	<title>{site.domain}</title>
	<meta name="description" content="{site.fullName}: software engineer and CS master's student. CV, projects and links." />
	<meta property="og:title" content={site.domain} />
	<meta property="og:url" content="https://{site.domain}/" />
</svelte:head>

<Hero />

{#snippet heading(index: string, label: string, title: string)}
	<div class="flex items-start justify-between gap-4">
		<div>
			<p class="font-mono text-[13px] tracking-[0.12em] text-muted uppercase">
				<span class="text-accent">{index}</span> · {label}
			</p>
			<h2 class="mt-2 font-serif text-[clamp(30px,4vw,40px)] leading-tight font-bold tracking-[-0.02em]">
				{title}
			</h2>
		</div>
		<span
			aria-hidden="true"
			class="grid size-11 shrink-0 place-items-center rounded-full border border-line text-lg transition-[background-color,border-color,color,rotate] duration-300 group-hover:-rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-surface"
		>
			→
		</span>
	</div>
{/snippet}

<section aria-label="Start here" class="grid gap-5 pt-16 pb-6 md:grid-cols-2">
	<a href="/cv" class={door}>
		{@render heading('01', 'Curriculum vitae', 'Where I am now')}
		<ul class="mt-6 divide-y divide-line border-y border-line">
			{#each now as item (item.what)}
				<li class="flex items-baseline justify-between gap-4 py-3">
					<span class="font-medium">{item.what}</span>
					<span class="text-right font-mono text-[13px] text-muted">{item.where}</span>
				</li>
			{/each}
		</ul>
		<p class="mt-auto pt-6 font-mono text-[13px] text-muted">
			Experience, education and skills · printable
		</p>
	</a>

	<a href="/projects" class={door}>
		{@render heading('02', 'Projects', 'What I build')}
		<ul class="mt-6 divide-y divide-line border-y border-line">
			{#each teaser as project (project.slug)}
				<li class="grid grid-cols-[1fr_auto] items-baseline gap-x-4 py-3">
					<span class="font-medium">{project.title}</span>
					<span class="font-mono text-[13px] text-muted">{project.when}</span>
					<span class="col-span-2 text-[15px] leading-snug text-muted">{project.summary}</span>
				</li>
			{/each}
		</ul>
		<p class="mt-auto pt-6 font-mono text-[13px] text-muted">
			{#if projects.length > teaser.length}+{projects.length - teaser.length} more ·
			{/if}all projects
		</p>
	</a>
</section>
