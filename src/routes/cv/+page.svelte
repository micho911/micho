<script lang="ts">
	import Section from '#lib/components/Section.svelte';
	import { cv, external, site, socials, type Entry } from '#lib/content.ts';
</script>

<svelte:head>
	<title>{site.fullName} · CV</title>
	<meta name="description" content="Curriculum vitae of {site.fullName}." />
</svelte:head>

{#snippet entries(list: Entry[])}
	{#each list as entry, i (i)}
		<div class="mb-6 grid gap-x-6 gap-y-1 sm:grid-cols-[140px_1fr]">
			<span class="font-mono text-sm leading-7 text-muted">{entry.when}</span>
			<div>
				<h3 class="text-lg font-semibold">{entry.title}</h3>
				{#if entry.place}
					<p class="font-mono text-[13px] text-muted">{entry.place}</p>
				{/if}
				{#if entry.points.length}
					<ul class="mt-1 list-disc pl-[18px] text-muted">
						{#each entry.points as point, j (j)}
							<li>{point}</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	{/each}
{/snippet}

<article class="max-w-3xl">
	<header class="border-b border-line pt-14 pb-6 print:pt-0">
		<h1
			class="text-shadow-sun font-serif text-[clamp(44px,8vw,72px)] leading-none font-extrabold tracking-[-0.03em]"
		>
			{site.fullName}
		</h1>
		<p class="mt-2.5 text-xl text-muted">{site.role}</p>
		<p class="mt-5 max-w-[62ch] leading-relaxed">{cv.summary}</p>
		<div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm">
			{#each socials as link (link.label)}
				<a href={link.href} {...external(link.href)} class="hover:text-accent">
					{link.href.startsWith('mailto:') ? site.email : link.label}
				</a>
			{/each}
		</div>
		<div class="mt-6 flex flex-wrap gap-2.5 print:hidden">
			<a
				href="/michel-yildirim-cv.pdf"
				download
				class="rounded-full border border-line bg-surface px-[18px] py-2.5 font-medium shadow-sun-sm hover:border-muted"
			>
				Download PDF
			</a>
			<a
				href="/michel-yildirim-cv.pdf"
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-full border border-line px-[18px] py-2.5 font-medium text-muted hover:border-muted hover:text-ink"
			>
				View printable version ↗
			</a>
		</div>
	</header>

	<Section id="experience" title="Experience">
		{@render entries(cv.experience)}
	</Section>

	<Section id="exploration" title="Research, projects &amp; competitions">
		{@render entries(cv.exploration)}
	</Section>

	<Section id="education" title="Education">
		{@render entries(cv.education)}
	</Section>

	<Section id="skills" title="Skills">
		{#each cv.skills as skill (skill.group)}
			<div class="mb-3 grid gap-x-6 sm:grid-cols-[140px_1fr]">
				<span class="font-mono text-sm leading-7 text-muted">{skill.group}</span>
				<p>{skill.items}</p>
			</div>
		{/each}
	</Section>
</article>
