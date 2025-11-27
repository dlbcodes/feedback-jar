import { stripe } from '~~/server/utils/stripe'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	const profileId = event.context.profileId

	if (!profileId) {
		throw createError({
			statusCode: 401,
			message: 'Unauthorized',
		})
	}

	const profile = await prisma.profile.findUnique({
		where: { id: profileId },
	})

	if (!profile?.stripeCustomerId) {
		throw createError({
			statusCode: 400,
			message: 'No subscription found',
		})
	}

	const session = await stripe.billingPortal.sessions.create({
		customer: profile.stripeCustomerId,
		return_url: `${process.env.NUXT_PUBLIC_APP_URL}/dashboard`,
	})

	return { url: session.url }
})