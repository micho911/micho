// Everything you'd want to edit lives here. Pages only read from this file.

export const site = {
	name: 'Michel',
	fullName: 'Michel Yildirim',
	wordmark: 'micho',
	domain: 'micho.tech',
	role: 'Software engineer · CS MSc student in AI, Aarhus University',
	intro:
		"I'm a software engineer at Morch Solutions and a master's student in computer science, specialising in AI, at Aarhus University. On the side I explore machine learning, mostly through research projects and competitions.",
	email: 'michelyldrm@gmail.com'
};

export type Link = { label: string; href: string };

/** Anything leaving the site opens in a new tab; links within it don't. */
export const external = (href: string) =>
	href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {};

export const socials: Link[] = [
	{ label: 'Email', href: `mailto:${site.email}` },
	{ label: 'GitHub', href: 'https://github.com/micho911' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/michelyildirim/' }
];

/** What I'm doing right now, for the CV teaser on the home page. */
export const now: { what: string; where: string }[] = [
	{ what: 'Software engineer', where: 'Morch Solutions' },
	{ what: 'Research assistant', where: 'CLAN, Aarhus University' },
	{ what: 'MSc Computer Science, AI', where: 'Aarhus University' },
	{ what: 'Exchange semester', where: 'NUS, Singapore' }
];

/**
 * `summary` is the one-liner on the home page; `body` is the longer story on /projects.
 * The slug is the anchor, so /projects#no-hands jumps straight to it.
 */
export type Project = {
	slug: string;
	title: string;
	when: string;
	kind: string;
	summary: string;
	body: string[];
	tags: string[];
	href?: string;
};

export const projects: Project[] = [
	{
		slug: 'no-hands',
		title: 'No Hands',
		when: '2025 —',
		kind: 'Research at CLAN, and in my free time',
		summary: 'Programming by voice, and how well current AI tools actually handle it.',
		body: [
			"Can you program without using your hands at all? A few tools say they can do it, so we've been testing how well they actually work, especially for developers with motor impairments.",
			"On the side I'm building a prototype for it: a VS Code extension where you talk and it turns that into code edits and editor commands. Still in progress, repo coming when it's ready."
		],
		tags: ['voice programming', 'accessibility', 'LLM tool use', 'user study', 'VS Code']
	},
	{
		slug: 'vasknu',
		title: 'vasknu',
		when: 'Live',
		kind: 'Side project',
		summary: "A daily heads-up on when tomorrow's electricity is cheapest in Denmark.",
		body: [
			"A free daily heads-up at 13:00 on when tomorrow's electricity is cheapest in Denmark, so you know when to run the washing machine or charge the car.",
			'Delivered by push notification or Discord, with no account needed.'
		],
		tags: ['energy prices', 'notifications', 'Discord'],
		href: 'https://vasknu.micho.tech'
	},
	{
		slug: 'dm-i-ai',
		title: 'Danish Championship in AI',
		when: '2025',
		kind: 'Competition · solo',
		summary: 'My solo attempt at the Danish national AI championship.',
		body: [
			'DM i AI is usually done in teams; I gave it a go on my own. Three problems: a healthcare RAG pipeline, a reinforcement-learning agent driving a simulated car, and tumour segmentation on medical images.',
			"A lot of it was new to me, so none of the three is quite finished, but everything got submitted. The README has the details."
		],
		tags: ['RAG', 'reinforcement learning', 'computer vision', 'HPC'],
		href: 'https://github.com/micho911/danish-ai-championship-2025'
	},
	{
		slug: 'energy-forecasting',
		title: 'Energy forecasting',
		when: '2024 — 2025',
		kind: 'Competitions',
		summary: 'Power and wind forecasting for two energy-trading case competitions.',
		body: [
			'Nitor Energy Quantitative Trading Case Competition: forecasting models on two years of hourly European power-grid data. Placed 12th of 45 teams.',
			'Incommodities Case Crunch: a LightGBM pipeline forecasting wind-energy yield from spatio-temporal weather data.'
		],
		tags: ['time series', 'LightGBM', 'forecasting']
	},
	{
		slug: 'wikinsert',
		title: 'Wikinsert',
		when: '2024',
		kind: 'Bachelor project · CLAN',
		summary: 'An entity-aware insertion tool for Wikipedia editors.',
		body: [
			'My bachelor project, built with CLAN at Aarhus University: an entity-aware insertion tool for Wikipedia editors.'
		],
		tags: ['NLP', 'Wikipedia'],
		href: 'https://github.com/au-clan/wikinsert'
	}
];

export type Entry = { when: string; title: string; place?: string; points: string[] };

export const cv = {
	summary:
		"Software engineer at Morch Solutions, working on a mix of client projects across different codebases and stacks. I also work on AI projects and the occasional competition, mostly reinforcement learning, NLP and LLM agents.",
	experience: [
		{
			when: 'Jun 2024 — now',
			title: 'Junior Software Engineer · Morch Solutions',
			place: 'Aarhus, Denmark',
			points: [
				'Work across a portfolio of clients, from small businesses to enterprise, often switching between codebases, stacks and domains within the same day.',
				'Field-service platform for cable and broadband providers: technician booking and scheduling, job tracking, equipment orders and Wi-Fi labels.',
				'The full IT system for a rehearsal-space business: bookings for bands, musicians and teachers, check-in, door codes, room maintenance and their expansion into podcast studios.',
				'Smaller end-to-end web apps, and well-scoped technical tasks such as API integrations for enterprise clients.',
				'Agentic development as the default way of working: coding agents do much of the implementation, and my time goes into scoping, review and verification.',
				'CI/CD, deployment and DevOps: automated build, test and release pipelines in GitLab, and Docker.'
			]
		},
		{
			when: '2025 — now',
			title: 'Research Assistant · CLAN, Aarhus University',
			place: 'Aarhus, Denmark',
			points: [
				'No Hands: research on programming by voice, for developers with motor impairments.',
				'Set up and ran a user study on how well current AI tools support voice programming.',
				'Building a prototype VS Code extension that turns speech into code edits and editor commands using LLM tool use.'
			]
		},
		{
			when: 'Aug 2023 — Dec 2025',
			title: 'Teaching Assistant · Aarhus University',
			place: 'Aarhus, Denmark',
			points: [
				'Taught 25+ students per semester in object-oriented programming in Java.',
				'Wrote an automated runner that tests student submissions against test suites to support grading.',
				'Taught introductory object-oriented modelling (UML) and JavaScript in a digital fundamentals course.'
			]
		}
	] satisfies Entry[],
	exploration: [
		{
			when: '2025',
			title: 'Danish Championship in AI · solo entry',
			points: [
				'Tumour segmentation in medical images (computer vision).',
				'Reinforcement learning for a simulated car driving on sensor input.',
				'A retrieval-augmented LLM pipeline for healthcare questions, tuned for accuracy and speed.'
			]
		},
		{
			when: '2025',
			title: 'Nitor Energy Quantitative Trading Case Competition',
			points: [
				'Forecasting models on two years of hourly European power-grid data. Placed 12th of 45 teams.'
			]
		},
		{
			when: 'Summer 2024',
			title: 'Wikinsert · bachelor project',
			points: ['An entity-aware insertion tool for Wikipedia editors, built with CLAN at Aarhus University.']
		},
		{
			when: '2024',
			title: 'Incommodities Case Crunch',
			points: [
				'A LightGBM pipeline forecasting wind-energy yield from spatio-temporal weather data.'
			]
		},
		{
			when: '2024',
			title: 'AUHack',
			points: [
				'Simulated CPU/GPU scheduling with dynamic priority queues. Honorary mention among 30+ teams.'
			]
		}
	] satisfies Entry[],
	education: [
		{
			when: 'Aug 2025 — Jul 2027',
			title: 'MSc Computer Science, specialising in AI · Aarhus University',
			place: 'Aarhus, Denmark',
			points: []
		},
		{
			when: 'Aug 2026 — Dec 2026',
			title: 'Exchange semester, School of Computing · National University of Singapore',
			place: 'Singapore',
			points: ['Reinforcement learning and sequential decision making; smart systems and AI governance.']
		},
		{
			when: 'Sep 2022 — Jul 2025',
			title: 'BSc Computer Science · Aarhus University',
			place: 'Aarhus, Denmark',
			points: [
				'Machine learning, linear algebra, compilers, distributed systems, programming languages.'
			]
		},
		{
			when: 'Aug 2019 — Jul 2022',
			title: 'International Baccalaureate · Nyborg Gymnasium',
			place: 'Nyborg, Denmark',
			points: []
		}
	] satisfies Entry[],
	skills: [
		{
			group: 'Engineering',
			items: 'Web apps and back offices, APIs, CI/CD, Docker, Git, automated testing, code review'
		},
		{
			group: 'AI & ML',
			items: 'Agentic and AI-first systems, LLM tool use and MCP, fine-tuning, NLP, RAG, reinforcement learning, time-series forecasting, data pipelines, computer vision'
		},
		{ group: 'Programming', items: 'Python, TypeScript, JavaScript, Java, Kotlin, PHP, C/C++, OCaml' },
		{
			group: 'Frameworks',
			items: 'PyTorch, TensorFlow, scikit-learn, LightGBM, pandas, Polars, SvelteKit, React, HTMX, Tailwind CSS, Maven, Gradle'
		},
		{ group: 'Languages', items: 'English, Danish and Turkish, all native' }
	]
};
