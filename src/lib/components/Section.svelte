<script lang="ts">
	import type { Snippet } from 'svelte';

	let { id, title, children }: { id: string; title: string; children: Snippet } = $props();
</script>

<section {id} aria-labelledby="{id}-title" class="scroll-mt-6 py-14">
	<h2 id="{id}-title" class="mb-6 font-mono text-[13px] tracking-[0.12em] text-muted uppercase">
		{title}
	</h2>
	{@render children()}
</section>
