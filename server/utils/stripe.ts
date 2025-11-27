import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2024-11-20.acacia',
})

// Plan limits
export const PLAN_LIMITS = {
	trial: {
		projects: 10,
		events: 100000, // 100k per month
	},
	free: {
		projects: 1,
		events: 10000, // 10k per month
	},
	pro: {
		projects: 10,
		events: 100000, // 100k per month
	},
	enterprise: {
		projects: 999,
		events: 1000000, // 1M per month
	},
}