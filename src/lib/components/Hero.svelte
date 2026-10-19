<script lang="ts">
	import { onMount } from 'svelte';
	import { external, socials, site } from '#lib/content.ts';
	import { light } from '#lib/light.svelte.ts';
	import {
		bearing,
		clamp,
		clock,
		daylight,
		lamplight,
		longShadow,
		mixLight,
		moonOf,
		skyPoint,
		skyToday,
		sunAt,
		sunColor
	} from '#lib/sun.ts';

	let rect = $state<DOMRect | null>(null);
	let fontSize = $state(200);
	let wordmark: HTMLElement;

	const sun = $derived(light.sun);
	const dark = $derived(light.dark);
	const sky = $derived(light.obs ? skyToday(light.obs) : null);
	// Through twilight the sun's shadows slowly hand over to the lamp's, so nothing snaps.
	const shadowLight = $derived.by(() => {
		if (!sun) return null;
		const day = daylight(sun);
		return dark > 0 && rect && light.lamp ? mixLight(day, lamplight(light.lamp, rect), dark) : day;
	});
	const textShadow = $derived(
		shadowLight &&
			longShadow(
				shadowLight,
				fontSize / 160,
				0.16 + 0.39 * dark,
				dark > 0
					? `${-shadowLight.dx * 1.5}px ${-shadowLight.dy * 1.5}px 0 rgb(242 181 92 / ${(0.35 * dark).toFixed(3)})`
					: undefined
			)
	);

	const sunPos = $derived(sun && sky ? skyPoint(sun.hourAngle, sun.el, sky.peak) : { x: 30, y: 40 });
	const moonPos = $derived.by(() => {
		if (!sun || !sky) return { x: 70, y: 160 };
		const m = moonOf(sun);
		return skyPoint(m.hourAngle, m.el, sky.peak);
	});
	const color = $derived(sun ? sunColor(sun) : 'rgb(251 176 36)');
	const glow = $derived(sun ? 22 + 34 * (1 - clamp(sun.el / 20, 0, 1)) : 30);
	// Strongest with the sun right on the horizon, gone by afternoon and in deep twilight.
	const afterglow = $derived(sun ? clamp(1 - Math.abs(sun.el - 1) / 9, 0, 1) : 0);
	const horizon = $derived.by(() => {
		if (!sky || !light.obs) return [];
		const marks: { x: number; label: string }[] = [];
		for (const [at, arrow] of [
			[sky.rise, '↑'],
			[sky.set, '↓']
		] as const) {
			if (at === null) continue;
			const s = sunAt(at, light.obs);
			marks.push({ x: skyPoint(s.hourAngle, 0, sky.peak).x, label: `${arrow} ${clock(at)}` });
		}
		return marks;
	});

	// A fixed scatter of stars that fade in with the dark.
	let seed = 7;
	const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
	const stars = Array.from({ length: 34 }, () => ({
		x: 1 + rand() * 98,
		y: 4 + rand() * 80,
		size: rand() < 0.2 ? 2 : 1,
		delay: rand() * 4
	}));

	const readout = $derived.by(() => {
		if (!sun) return '';
		const time = clock(light.minutes);
		if (light.night) {
			const how = light.canHover ? 'your cursor is the lamp' : 'tap anywhere to move the lamp';
			return `${time} · the sun is ${Math.round(-sun.el)}° below your horizon, so ${how}`;
		}
		const where =
			sun.el > 0
				? `${Math.round(sun.el)}° up in the ${bearing(sun.az)}`
				: `just under the ${bearing(sun.az)} horizon`;
		return `${time} · your sun is ${where}${light.live ? '' : ' (simulated)'}`;
	});

	// Until the visitor moves the pointer, the lamp hangs just above and right of the wordmark.
	function measure() {
		rect = wordmark.getBoundingClientRect();
		fontSize = parseFloat(getComputedStyle(wordmark).fontSize);
		light.anchor = { x: Math.min(innerWidth - 40, rect.right + 80), y: rect.top - 60 };
	}

	onMount(() => {
		measure();
		return () => (light.anchor = null);
	});
</script>

<svelte:window onscroll={measure} onresize={measure} />

<section class="pt-[5vh]" aria-labelledby="hello">
	<div aria-hidden="true" class="mb-3">
		<!-- Clipped only at the horizon, so the sun sinks through it and the moon climbs out. -->
		<div class="relative h-24 border-b border-line [clip-path:inset(-120px_-120px_0_-120px)]">
			<div
				class="absolute inset-0"
				style:opacity={afterglow * 0.55}
				style:background="radial-gradient(55% 100% at {sunPos.x}% 100%, {color}, transparent 75%)"
			></div>

			{#each stars as star, i (i)}
				<span
					class="star absolute rounded-full bg-ink"
					style:left="{star.x}%"
					style:top="{star.y}%"
					style:width="{star.size}px"
					style:height="{star.size}px"
					style:animation-delay="{star.delay}s"
					style:--on={dark}
				></span>
			{/each}

			{#if sky}
				<svg
					class="absolute inset-0 size-full overflow-visible text-muted"
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
				>
					{#each [{ d: sky.sun, o: 0.5 * (1 - dark) }, { d: sky.moon, o: 0.4 * dark }] as arc, i (i)}
						<path
							d={arc.d}
							opacity={arc.o}
							fill="none"
							stroke="currentColor"
							stroke-width="1.2"
							stroke-dasharray="1 6"
							stroke-linecap="round"
							vector-effect="non-scaling-stroke"
						/>
					{/each}
				</svg>
			{/if}

			<span
				class="absolute size-[18px] -translate-1/2 rounded-full"
				style:left="{sunPos.x}%"
				style:top="{sunPos.y}%"
				style:background={color}
				style:box-shadow="0 0 0 6px color-mix(in srgb, {color} 20%, transparent), 0 0 {glow}px {color}"
			></span>
			<span
				class="absolute size-4 -translate-1/2 rounded-full bg-slate-200 shadow-[inset_-5px_-2px_0_#b7bfd3,0_0_24px_rgb(223_227_238/.35)]"
				style:left="{moonPos.x}%"
				style:top="{moonPos.y}%"
				style:opacity={dark}
			></span>
		</div>

		<div class="relative h-5 font-mono text-[11px] text-muted">
			{#each horizon as mark (mark.label)}
				<span
					class="absolute top-1 -translate-x-1/2 whitespace-nowrap"
					style:left="{clamp(mark.x, 6, 94)}%"
				>
					{mark.label}
				</span>
			{/each}
		</div>
	</div>

	<h1
		id="hello"
		bind:this={wordmark}
		class="font-serif text-[clamp(88px,21vw,240px)] leading-[0.9] font-extrabold tracking-[-0.045em]"
		style:text-shadow={textShadow ?? '6px 8px 0 rgb(var(--shadow) / .12)'}
	>
		{site.wordmark}
	</h1>

	<div class="mt-7 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
		<p class="max-w-[38ch] text-[clamp(19px,2.4vw,24px)] leading-snug">
			Hi, I'm <strong class="font-semibold">{site.name}</strong>. {site.intro}
		</p>

		<ul class="flex flex-wrap gap-2.5 md:justify-end" aria-label="Elsewhere">
			{#each socials as link (link.label)}
				<li>
					<a
						href={link.href}
						{...external(link.href)}
						class="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 font-mono text-[13px] shadow-sun-sm transition-[border-color] duration-300 hover:border-muted"
					>
						{link.label}
						<span
							aria-hidden="true"
							class="text-muted transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
						>
							↗
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<div class="mt-9 grid max-w-md gap-2.5 font-mono text-[13px] text-muted">
		<label for="time">The shadows here follow the real sun where you are. Drag it around.</label>
		<div class="flex items-center gap-3">
			<input
				id="time"
				type="range"
				min="0"
				max="1439"
				value={Math.floor(light.target)}
				oninput={(e) => light.scrub(e.currentTarget.valueAsNumber)}
				aria-valuetext="{clock(light.target)} local time"
				class="flex-1 cursor-grab accent-accent active:cursor-grabbing"
			/>
			{#if !light.live}
				<button
					type="button"
					onclick={() => light.backToNow()}
					class="rounded-full border border-line px-3 py-1 text-ink hover:border-muted"
				>
					now
				</button>
			{/if}
		</div>
		<span aria-live="polite">{readout}</span>
	</div>
</section>
