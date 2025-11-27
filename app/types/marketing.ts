interface SiteConfig {
	name: string;
	description: string,
	defaultOgImage: string,
	links: {
		x?: string;
		instagram?: string;
		facebook?: string;
	};
	email: string;
}

interface NavItem {
	title: string;
	href: string;
	disabled?: boolean;
}

interface FaqItem {
	question: string;
	answer: string;
}

interface PlanItem {
	plan: string;
	price: string;
	for: string;
	advantages: string[];
	recommended?: boolean;
}

export type { SiteConfig, NavItem, FaqItem, PlanItem };
