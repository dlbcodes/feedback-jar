import { stripe } from '~~/server/utils/stripe'
import { prisma } from "~~/server/utils/prisma";


export default defineEventHandler(async (event) => {
	const { priceId, tier } = await readBody(event)
	const user = await requireAuthUser(event);
	const profileId = user.id


	if (!profileId || !priceId || !tier) {
		throw createError({
			statusCode: 400,
			message: 'Missing required fields',
		})
	}

	const profile = await prisma.profile.findUnique({
		where: { id: profileId },
	})

	if (!profile) {
		throw createError({
			statusCode: 404,
			message: 'Profile not found',
		})
	}

	// Create or get Stripe customer
	let customerId = profile.stripeCustomerId

	if (!customerId) {
		const customer = await stripe.customers.create({
			email: user.email, // Add email to your schema if needed
			metadata: {
				profileId: profile.id,
			},
		})
		customerId = customer.id

		await prisma.profile.update({
			where: { id: profileId },
			data: { stripeCustomerId: customerId },
		})
	}

	// Create checkout session
	const session = await stripe.checkout.sessions.create({
		customer: customerId,
		line_items: [
			{
				price: priceId,
				quantity: 1,
			},
		],
		mode: 'subscription',
		success_url: `${process.env.NUXT_PUBLIC_APP_URL}/dashboard?success=true`,
		cancel_url: `${process.env.NUXT_PUBLIC_APP_URL}/pricing`,
		metadata: {
			profileId: profile.id,
			tier,
		},
	})

	return { url: session.url }
})