import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	// Only check on API routes that need it
	if (!event.path.startsWith('/api/projects') && !event.path.startsWith('/api/analytics')) {
		return
	}

	const profileId = event.context.profileId // Assume you set this in auth middleware

	if (!profileId) return

	const profile = await prisma.profile.findUnique({
		where: { id: profileId },
	})

	if (!profile) return

	// Check if trial expired and convert to free
	if (
		profile.subscriptionTier === 'trial' &&
		profile.trialEndsAt &&
		new Date() > profile.trialEndsAt
	) {
		await prisma.profile.update({
			where: { id: profileId },
			data: {
				subscriptionTier: 'free',
			},
		})
	}
})