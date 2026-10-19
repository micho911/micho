# micho.tech

**My personal hub: CV, projects and links.**

Every shadow on the page falls the way the real sun falls wherever the visitor is, right now.
Morning light comes from the left, noon shadows are short, sunset stretches them long and gold.
As the sun sets the page fades into night, the moon rises, and your cursor becomes the lamp.

No location prompt, no tracking, no server: it all runs in your browser from your clock and timezone.

[**micho.tech →**](https://micho.tech)

---

## How the sun works

```
your clock ──► time of day ──┐
                             ├──► sun position ──► shadow direction + length ──► every element on the page
your timezone ──► city ──────┘    (elevation, azimuth)
```

1. **Time.** `new Date()` reads the visitor's local clock.
2. **Place.** The browser exposes the visitor's timezone (`Europe/Amsterdam`). [`zones.ts`](src/lib/zones.ts) maps it to that city's coordinates, using the IANA timezone database. That's accurate to the city, with no permission prompt.
3. **Sun.** [`sunAt()`](src/lib/sun.ts) combines Earth's 23.44° tilt (the season) with the hour angle (time of day, 15° per hour) to get the sun's **elevation** and **azimuth**. The result is within a degree or two of the real sun.
4. **Shadows.** Shadow length is the real geometry, `1 / tan(elevation)`. Its direction is opposite the sun. The direction and length are published as CSS variables (`--sx`, `--sy`, `--len`), so the wordmark, cards and buttons all share one light source.
5. **Night.** Between +3° and −10° of sun elevation the page blends gradually into its night palette and the light source hands over to the cursor (or a tap on mobile).

### Things to try

- Drag the slider under the name to move the sun through the day.
- Turn on reduced motion in your OS: the entrance sweep is skipped and everything else still works.

## Stack

| | |
|---|---|
| Framework | [SvelteKit 3](https://svelte.dev/docs/kit) + Svelte 5 (runes) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Build | Vite 8, `adapter-static`, fully prerendered |
| Language | TypeScript 6 |
| Hosting | GitHub Pages, deployed by GitHub Actions |
| DNS | Cloudflare |

Requires **Node ≥ 22.17**.

## Getting started

```sh
npm install
npm run dev       # http://localhost:5173
npm run check     # type-check
npm run build     # static site → build/
npm run preview   # serve the production build
```

## Editing content

All content lives in one file: **[`src/lib/content.ts`](src/lib/content.ts)**. Name, intro, links, projects and the full CV are plain data, so you never touch markup to update the site.

```ts
export const projects: Project[] = [
	{
		title: 'vasknu',
		description: 'What it does and who it is for.',
		href: 'https://vasknu.micho.tech',
		meta: 'vasknu.micho.tech'
	}
];
```

The downloadable CV is [`cv/cv.tex`](cv/cv.tex), compiled by hand to `static/michel-yildirim-cv.pdf`. Its content mirrors the `/cv` page, so update both together.

## Project structure

```
src/
├── app.css                  Tailwind setup, day/night colours, shadow-sun utility
├── app.html                 HTML shell + fonts
├── lib/
│   ├── content.ts           ← everything you edit
│   ├── sun.ts               sun position + shadow maths (pure functions)
│   ├── light.svelte.ts      the shared light: clock, slider spring, lamp position
│   ├── zones.ts             timezone → [lat, lon] (generated)
│   └── components/
│       ├── SunLight.svelte  starts the light on every page and publishes it as CSS variables
│       ├── Hero.svelte      wordmark, sky strip, socials, time slider
│       └── Section.svelte
└── routes/
    ├── +layout.svelte       header, footer, dusk tint, night lamp
    ├── +page.svelte         the hub
    ├── cv/+page.svelte      the CV
    ├── projects/+page.svelte  the projects, in more depth
    └── +error.svelte        404
static/                      CNAME, favicon, .nojekyll
```

## Deploying

Every push to `main` builds and deploys through [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

**One-time setup:**

1. In the repo, go to **Settings → Pages → Source** and choose **GitHub Actions**.
2. In Cloudflare DNS for `micho.tech`, add these records, all set to **DNS only** (grey cloud):

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `<username>.github.io` |

3. Back in **Settings → Pages**, once the certificate is issued, tick **Enforce HTTPS**.

Subdomains like `vasknu.micho.tech` keep their own records and point wherever those apps run.

## Privacy

The site has no analytics, no cookies, no geolocation and no backend. The visitor's time and timezone are read in their browser and never leave it.

---

<sub>© Michel Yildirim. Written entirely by a coding agent.</sub>
