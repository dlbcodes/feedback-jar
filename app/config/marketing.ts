import type { SiteConfig, FaqItem, NavItem, PlanItem } from "~/types/marketing";


export const siteConfig: SiteConfig = {
	name: "Datomi",
	description: "Lightweight feedback capture for fast-moving teams. One script tag. Zero friction. All the context you need.",
	defaultOgImage: "/og-image.png",
	links: {
		x: "https://twitter.com/",
		instagram: "https://instagram.com/",
	},
	email: "hello@graphiqo.app",
};

export const pricing = [
	{
		label: "Free",
		price: "0",
		description: "Create and share up to 5 charts using our essential tools and templates.",
		features: [
			"Up to 5 charts",
			"Unlimited shares",
			"Access to basic templates",
			"Basic color schemes",
			"Graphiqo watermark on charts",
		],
	},
	{
		label: "Pro",
		price: "14",
		description: "Unlock full customization, premium templates, and advanced branding features.",
		features: [
			"Custom colors & fonts",
			"Access to all premium templates",
			"Remove Graphiqo watermark",
			"Add your own logo or watermark",
			"Priority support",
		],
	},
];



export const faqs = [
	{
		question: "How does feedback get collected?",
		answer:
			"Users click the widget, take a screenshot, and hit send — we capture full context automatically: URL, browser, OS, viewport, and metadata.",
	},
	{
		question: "Do I need to change my code to install it?",
		answer:
			"Nope. Just drop in one script tag with your project key. Works on any site — static, SPA, SSR, whatever you ship.",
	},
	{
		question: "Does it work on all browsers and devices?",
		answer:
			"Yes. Desktops, tablets, mobile browsers — the widget adapts instantly so users can submit feedback anywhere.",
	},
	{
		question: "Will it slow down my site?",
		answer:
			"Not at all. The script loads async, is tiny, and never blocks rendering. Your users won’t feel it.",
	},
	{
		question: "Does it include screenshots?",
		answer:
			"Absolutely. Users can capture a screenshot in one click — no extensions, no installs, no friction.",
	},
	{
		question: "What kind of context do I get?",
		answer:
			"Everything you need: page URL, browser, OS, viewport size, custom metadata, and the screenshot. No more guessing.",
	},
	{
		question: "Can I customize the feedback types?",
		answer:
			"Yes. Use built-in types like bug, feature, or UX issue — or create your own labels to fit your workflow.",
	},
	{
		question: "Can my whole team access the feedback?",
		answer:
			"Of course. Invite teammates and everyone gets the same clear reports — no forwarding emails or screenshots.",
	},
	{
		question: "Is the data private?",
		answer:
			"Totally. No tracking cookies, no creepy analytics, and everything is private by default. You own your data.",
	},
	{
		question: "Does it work with frameworks like Nuxt, React, or Next.js?",
		answer:
			"Yes — it works anywhere you can drop a script tag. If you prefer, there’s also an npm package.",
	},
	{
		question: "Is there a free plan?",
		answer:
			"Yep. Collect feedback for free on small projects — perfect for testing, MVPs, or side hustles.",
	},
	{
		question: "What happens if I hit my monthly limit?",
		answer:
			"We’ll warn you early. You can upgrade anytime, and nothing breaks if you cross the line.",
	},
	{
		question: "Can I cancel anytime?",
		answer:
			"100%. No contracts, no lock-in. Stay only if it’s helping you build better.",
	},
	{
		question: "Do you offer refunds?",
		answer:
			"If something’s not right, we’ll fix it — simple as that.",
	},
];

