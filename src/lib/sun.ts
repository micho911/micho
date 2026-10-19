// Where is the sun for the visitor right now, and which way do shadows fall?
// Uses only the local clock and timezone: no location prompt, no network.

import { zones } from './zones.ts';

const RAD = Math.PI / 180;

export type Observer = { lat: number; lon: number };
export type Sun = { el: number; az: number; hourAngle: number }; // degrees; az from south, + towards west
export type Light = { dx: number; dy: number; len: number }; // unit shadow direction + length factor
export type Point = { x: number; y: number };

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Legacy names some browsers still report.
const ALIASES: Record<string, string> = {
	'Asia/Calcutta': 'Asia/Kolkata',
	'Asia/Saigon': 'Asia/Ho_Chi_Minh',
	'Asia/Katmandu': 'Asia/Kathmandu',
	'Asia/Rangoon': 'Asia/Yangon',
	'Europe/Kiev': 'Europe/Kyiv',
	'Atlantic/Faeroe': 'Atlantic/Faroe',
	'America/Buenos_Aires': 'America/Argentina/Buenos_Aires'
};

/** The visitor's timezone city, e.g. Europe/Madrid → Madrid. Falls back to the UTC offset. */
export function observer(): Observer {
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
	const city = zones[ALIASES[tz] ?? tz];
	if (city) return { lat: city[0], lon: city[1] };

	const year = new Date().getFullYear();
	const std = Math.max(
		new Date(year, 0, 1).getTimezoneOffset(),
		new Date(year, 6, 1).getTimezoneOffset()
	);
	return { lat: 45, lon: -std / 4 }; // 1h of offset = 15°
}

/** Minutes since local midnight, with seconds as a fraction so the sun creeps rather than ticks. */
export function minutesNow() {
	const d = new Date();
	return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
}

/** Sun position today at the given local minute of the day. */
export function sunAt(minutes: number, { lat, lon }: Observer): Sun {
	const d = new Date();
	d.setHours(0, 0, Math.round(minutes * 60), 0);
	const doy =
		(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) -
			Date.UTC(d.getUTCFullYear(), 0, 0)) /
		864e5;
	const utcHours = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
	// NOAA's series for declination and the equation of time (good to a minute or so).
	const g = ((2 * Math.PI) / 365) * (doy - 1 + (utcHours - 12) / 24);
	const decl =
		0.006918 -
		0.399912 * Math.cos(g) +
		0.070257 * Math.sin(g) -
		0.006758 * Math.cos(2 * g) +
		0.000907 * Math.sin(2 * g) -
		0.002697 * Math.cos(3 * g) +
		0.00148 * Math.sin(3 * g);
	const eqTime =
		229.18 *
		(0.000075 +
			0.001868 * Math.cos(g) -
			0.032077 * Math.sin(g) -
			0.014615 * Math.cos(2 * g) -
			0.040849 * Math.sin(2 * g));
	const solarMinutes = utcHours * 60 + eqTime + 4 * lon;
	const hourAngle = ((((solarMinutes / 4) % 360) + 360) % 360) - 180;
	const H = hourAngle * RAD;
	const phi = lat * RAD;
	const el = Math.asin(
		Math.sin(phi) * Math.sin(decl) + Math.cos(phi) * Math.cos(decl) * Math.cos(H)
	);
	const az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(decl) * Math.cos(phi));
	return { el: el / RAD, az: az / RAD, hourAngle };
}

export const isNight = (sun: Sun) => sun.el < -4;

const smoothstep = (edge0: number, edge1: number, v: number) => {
	const t = clamp((v - edge0) / (edge1 - edge0), 0, 1);
	return t * t * (3 - 2 * t);
};

/** 0 in daylight, 1 at full night, easing through twilight (sun from +3° down to -10°). */
export const darkness = (sun: Sun) => smoothstep(3, -10, sun.el);

/** Blend two lights; `k` = 0 is all `a`, 1 is all `b`. */
export function mixLight(a: Light, b: Light, k: number): Light {
	const x = a.dx + (b.dx - a.dx) * k;
	const y = a.dy + (b.dy - a.dy) * k;
	const m = Math.hypot(x, y) || 1;
	return { dx: x / m, dy: y / m, len: a.len + (b.len - a.len) * k };
}

/** Morning light comes from the east (left) and throws shadows right; low sun = long shadows. */
export function daylight(sun: Sun): Light {
	const x = -Math.sin(sun.az * RAD);
	const y = 0.75;
	const m = Math.hypot(x, y);
	const len = sun.el > 0 ? clamp(1 / Math.tan(Math.max(sun.el, 1) * RAD), 0.35, 5) : 5;
	return { dx: x / m, dy: y / m, len };
}

/** At night the light is a lamp at `from`; shadows fall away from it. */
export function lamplight(from: Point, target: DOMRect): Light {
	const x = target.left + target.width / 2 - from.x;
	const y = target.top + target.height / 2 - from.y;
	const d = Math.hypot(x, y) || 1;
	return { dx: x / d, dy: y / d, len: clamp(d / 260, 0.5, 4.5) };
}

/** A stepped long shadow as a text-shadow value: many 1-step layers fading out. */
export function longShadow({ dx, dy, len }: Light, step: number, alpha: number, rim?: string) {
	const n = Math.round(clamp(len * 14, 3, 70));
	const layers = rim ? [rim] : [];
	for (let i = 1; i <= n; i++) {
		const a = (alpha * (1 - i / (n + 1))).toFixed(3);
		layers.push(
			`${(dx * step * i).toFixed(1)}px ${(dy * step * i).toFixed(1)}px 0 rgb(var(--shadow) / ${a})`
		);
	}
	return layers.join(',');
}

/** Warm gold in the golden hour, turning pink as the sun goes under, fading out into the night. */
export function tint(sun: Sun) {
	if (sun.el >= 14) return 'transparent';
	const pink = clamp(-sun.el / 4, 0, 1);
	const r = Math.round(255 - 41 * pink);
	const g = Math.round(170 - 30 * pink);
	const b = Math.round(90 + 80 * pink);
	const a = (sun.el > 0 ? ((14 - sun.el) / 14) * 0.13 : 0.13 + 0.01 * pink) * (1 - darkness(sun));
	return `rgb(${r} ${g} ${b} / ${a.toFixed(3)})`;
}

export type Sky = { peak: number; rise: number | null; set: number | null; sun: string; moon: string };

/** Map a body to the sky strip, in %. `peak` is the elevation that reaches near the top. */
export function skyPoint(hourAngle: number, el: number, peak: number): Point {
	return { x: 50 + (hourAngle / 180) * 50, y: clamp(100 - (el / peak) * 78, 6, 160) };
}

/** The moon rides opposite the sun, so it rises in the east as the sun sets in the west. */
export const moonOf = (sun: Sun) => ({
	hourAngle: sun.hourAngle > 0 ? sun.hourAngle - 180 : sun.hourAngle + 180,
	el: -sun.el
});

/**
 * Today's sky for an observer: sunrise and sunset (minutes, or null in polar day or night) and the
 * paths the sun and moon trace across the strip, as SVG path data in a 100×100 box.
 */
export function skyToday(obs: Observer): Sky {
	const samples = Array.from({ length: 289 }, (_, i) => sunAt(i * 5, obs));
	const peak = Math.max(20, ...samples.map((s) => s.el));
	let rise: number | null = null;
	let set: number | null = null;
	// Rise and set are when the sun's top edge meets the horizon, refraction included.
	const HORIZON = -0.833;
	for (let i = 1; i < samples.length; i++) {
		const [a, b] = [samples[i - 1].el - HORIZON, samples[i].el - HORIZON];
		const at = (i - 1 + a / (a - b)) * 5;
		if (a < 0 && b >= 0) rise = at;
		if (a >= 0 && b < 0) set = at;
	}
	const path = (points: Point[]) =>
		points
			.map((p, i) => `${i && Math.abs(p.x - points[i - 1].x) < 50 ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
			.join('');
	return {
		peak,
		rise,
		set,
		sun: path(samples.map((s) => skyPoint(s.hourAngle, s.el, peak))),
		moon: path(samples.map((s) => moonOf(s)).map((m) => skyPoint(m.hourAngle, m.el, peak)))
	};
}

/** High sun is pale gold; it deepens to orange and then red as it nears the horizon. */
export function sunColor(sun: Sun) {
	const stops: [number, [number, number, number]][] = [
		[-2, [226, 72, 60]],
		[4, [249, 115, 22]],
		[14, [251, 176, 36]],
		[30, [253, 214, 99]]
	];
	const el = clamp(sun.el, stops[0][0], stops[stops.length - 1][0]);
	const i = Math.max(1, stops.findIndex(([e]) => e >= el));
	const [[e0, c0], [e1, c1]] = [stops[i - 1], stops[i]];
	const k = (el - e0) / (e1 - e0);
	return `rgb(${c0.map((c, j) => Math.round(c + (c1[j] - c) * k)).join(' ')})`;
}

const COMPASS = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
export const bearing = (az: number) => COMPASS[Math.round((((az + 180) % 360) + 360) % 360 / 45) % 8];

export const clock = (m: number) =>
	`${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.floor(m) % 60).padStart(2, '0')}`;
