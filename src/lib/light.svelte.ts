// The page's one light source, shared by every route. The layout starts it and publishes it as
// CSS variables; the hero reads it to draw the sky and to drive the wordmark's long shadow.

import {
	type Observer,
	type Point,
	darkness,
	isNight,
	minutesNow,
	observer,
	sunAt
} from './sun.ts';

const wrap = (m: number) => ((m % 1440) + 1440) % 1440;

class Light {
	obs = $state<Observer | null>(null);
	minutes = $state(14 * 60); // what's drawn
	target = $state(14 * 60); // where the clock is heading; the slider shows this
	live = $state(true);
	pointer = $state<Point | null>(null);
	/** Where the lamp rests until the visitor moves the pointer. The hero parks it by the wordmark. */
	anchor = $state<Point | null>(null);
	canHover = $state(true);

	sun = $derived(this.obs ? sunAt(this.minutes, this.obs) : null);
	night = $derived(this.sun ? isNight(this.sun) : false);
	dark = $derived(this.sun ? darkness(this.sun) : 0);
	lamp = $derived(this.pointer ?? this.anchor);

	// The drawn clock chases `target` on a critically damped spring: clicks on the track glide
	// there, drags follow with a soft lag, and nothing ever teleports.
	#frame = 0;
	#last = 0;
	#velocity = 0;
	#stiffness = 9;
	#gap = () => ((((this.target - this.minutes) % 1440) + 2160) % 1440) - 720;

	#step = (t: number) => {
		const dt = Math.min(1 / 30, (t - this.#last) / 1000);
		this.#last = t;
		const w = this.#stiffness;
		this.#velocity += (w * w * this.#gap() - 2 * w * this.#velocity) * dt;
		this.minutes = wrap(this.minutes + this.#velocity * dt);
		if (Math.abs(this.#gap()) < 0.05 && Math.abs(this.#velocity) < 0.5) {
			this.minutes = this.target;
			this.#velocity = 0;
			this.#frame = 0;
			return;
		}
		this.#frame = requestAnimationFrame(this.#step);
	};

	chase(to: number, w = 9) {
		this.target = wrap(to);
		this.#stiffness = w;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			this.minutes = this.target;
			return;
		}
		if (!this.#frame) {
			this.#last = performance.now();
			this.#frame = requestAnimationFrame(this.#step);
		}
	}

	scrub(to: number) {
		this.live = false;
		this.chase(to);
	}

	backToNow() {
		this.live = true;
		this.chase(minutesNow());
	}

	/** Called once by the layout, on whichever page the visitor lands. Returns the cleanup. */
	start() {
		this.obs = observer();
		this.canHover = matchMedia('(hover: hover)').matches;

		// Entrance: a slow rise from a few hours earlier up to now.
		const now = minutesNow();
		this.minutes = this.target = wrap(now - 300);
		this.chase(now, 3.2);

		const timer = setInterval(() => this.live && !this.#frame && this.chase(minutesNow()), 1000);
		return () => {
			cancelAnimationFrame(this.#frame);
			this.#frame = 0;
			clearInterval(timer);
		};
	}
}

export const light = new Light();
