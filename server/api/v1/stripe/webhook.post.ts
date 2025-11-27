import { stripe } from '~~/server/utils/stripe'
import { prisma } from "~~/server/utils/prisma";
import type Stripe from 'stripe'


export default defineEventHandler(async (event) => {
	const body = await readRawBody(event)
	const signature = getHeader(event, 'stripe-signature')

	console.log('webhook')

	if (!body || !signature) {
		throw createError({
			statusCode: 400,
			message: 'Missing body or signature',
		})
	}

	let stripeEvent: Stripe.Event

	try {
		stripeEvent = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		)
	} catch (err) {
		throw createError({
			statusCode: 400,
			message: `Webhook Error: ${err.message}`,
		})
	}

	// Handle events
	switch (stripeEvent.type) {
		case 'checkout.session.completed': {
			const session = stripeEvent.data.object as Stripe.Checkout.Session
			const profileId = session.metadata?.profileId
			const tier = session.metadata?.tier

			if (profileId && tier) {
				await prisma.profile.update({
					where: { id: profileId },
					data: {
						stripeSubscriptionId: session.subscription as string,
						stripePriceId: session.metadata.priceId,
						subscriptionTier: tier,
						trialEndsAt: null, // Clear trial
					},
				})
			}
			break
		}

		case 'customer.subscription.updated': {
			const subscription = stripeEvent.data.object as Stripe.Subscription
			const profile = await prisma.profile.findFirst({
				where: { stripeCustomerId: subscription.customer as string },
			})

			if (profile) {
				await prisma.profile.update({
					where: { id: profile.id },
					data: {
						stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
					},
				})
			}
			break
		}

		case 'customer.subscription.deleted': {
			const subscription = stripeEvent.data.object as Stripe.Subscription
			const profile = await prisma.profile.findFirst({
				where: { stripeCustomerId: subscription.customer as string },
			})

			if (profile) {
				await prisma.profile.update({
					where: { id: profile.id },
					data: {
						subscriptionTier: 'free',
						stripeSubscriptionId: null,
						stripePriceId: null,
						stripeCurrentPeriodEnd: null,
					},
				})
			}
			break
		}
	}

	return { received: true }
})