import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		// Fully static build for GitHub Pages; 404.html handles unknown paths.
		sveltekit({ adapter: adapter({ fallback: '404.html' }) })
	]
});
