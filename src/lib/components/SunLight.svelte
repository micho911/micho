<script lang="ts">
	import { onMount } from 'svelte';
	import { light } from '#lib/light.svelte.ts';
	import { daylight, mixLight, tint } from '#lib/sun.ts';

	// Publish the light to the whole page. Cards and links can't each track the lamp, so at night
	// their shadows settle straight down instead of following the wordmark's.
	$effect(() => {
		const { sun, dark, lamp } = light;
		if (!sun) return;
		const root = document.documentElement;
		const page = mixLight(daylight(sun), { dx: 0, dy: 1, len: 1.2 }, dark);
		root.dataset.light = dark > 0.5 ? 'night' : 'day';
		root.style.setProperty('--dark', dark.toFixed(3));
		root.style.setProperty('--shadow', [60, 40, 20].map((c) => Math.round(c * (1 - dark))).join(' '));
		root.style.setProperty('--sx', page.dx.toFixed(3));
		root.style.setProperty('--sy', page.dy.toFixed(3));
		root.style.setProperty('--len', page.len.toFixed(3));
		root.style.setProperty('--tint', tint(sun));
		if (lamp) {
			root.style.setProperty('--lx', `${lamp.x}px`);
			root.style.setProperty('--ly', `${lamp.y}px`);
		}
	});

	function movePointer(e: PointerEvent) {
		// Dragging the time slider shouldn't drag the lamp along with it.
		if (!(e.target instanceof HTMLInputElement && e.target.type === 'range')) {
			light.pointer = { x: e.clientX, y: e.clientY };
		}
	}

	onMount(() => light.start());
</script>

<svelte:window onpointermove={movePointer} onpointerdown={movePointer} />
