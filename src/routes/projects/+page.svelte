<script lang="ts">
	import { external, projects, site } from '#lib/content.ts';
</script>

<svelte:head>
	<title>{site.fullName} · Projects</title>
	<meta name="description" content="Projects by {site.fullName}: research, competitions and side projects." />
</svelte:head>

<header class="pt-14 pb-10">
	<h1
		class="text-shadow-sun font-serif text-[clamp(44px,8vw,72px)] leading-none font-extrabold tracking-[-0.03em]"
	>
		Projects
	</h1>
	<p class="mt-5 max-w-[56ch] text-xl leading-snug text-muted">
		Research, competitions and things I build in my free time.
	</p>
	<nav aria-label="Projects" class="mt-8 flex flex-wrap gap-2.5">
		{#each projects as project (project.slug)}
			<a
				href="#{project.slug}"
				class="rounded-full border border-line bg-surface px-4 py-2 font-mono text-[13px] shadow-sun-sm transition-[border-color] duration-300 hover:border-muted"
			>
				{project.title}
			</a>
		{/each}
	</nav>
</header>

{#each projects as project, i (project.slug)}
	<article
		id={project.slug}
		aria-labelledby="{project.slug}-title"
		class="grid scroll-mt-6 gap-x-10 gap-y-4 border-t border-line py-12 md:grid-cols-[180px_1fr]"
	>
		<div class="flex gap-4 font-mono text-[13px] leading-6 text-muted md:flex-col md:gap-1 md:pt-2">
			<span class="text-accent">{String(i + 1).padStart(2, '0')}</span>
			<span>{project.when}</span>
			<span>{project.kind}</span>
		</div>

		<div class="max-w-[64ch]">
			<h2
				id="{project.slug}-title"
				class="text-shadow-sun font-serif text-[clamp(32px,5vw,48px)] leading-none font-bold tracking-[-0.025em]"
			>
				{project.title}
			</h2>
			<p class="mt-3 text-xl leading-snug">{project.summary}</p>
			{#each project.body as paragraph, j (j)}
				<p class="mt-4 leading-relaxed text-muted">{paragraph}</p>
			{/each}

			<div class="mt-6 flex flex-wrap items-center gap-2">
				{#each project.tags as tag (tag)}
					<span class="rounded-full border border-line px-3 py-1 font-mono text-[12px] text-muted">
						{tag}
					</span>
				{/each}
				{#if project.href}
					<a
						href={project.href}
						{...external(project.href)}
						class="group ml-auto inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 font-mono text-[13px] shadow-sun-sm transition-[border-color] duration-300 hover:border-muted"
					>
						{project.href.replace(/^https?:\/\//, '')}
						<span
							aria-hidden="true"
							class="text-muted transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
						>
							↗
						</span>
					</a>
				{/if}
			</div>
		</div>
	</article>
{/each}
