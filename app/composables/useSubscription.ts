export const useSubscription = () => {
	const user = useSupabaseUser() // Or your auth solution

	const checkTrial = async () => {
		// Get profile from your API
		const profile = await $fetch('/api/v1/profile')

		if (!profile.trialEndsAt) return null

		const now = new Date()
		const trialEnd = new Date(profile.trialEndsAt)
		const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

		return {
			isActive: now < trialEnd,
			daysLeft: daysLeft > 0 ? daysLeft : 0,
			endsAt: trialEnd,
		}
	}

	const createCheckout = async (priceId: string, tier: string) => {
		const { url } = await $fetch('/api/v1/stripe/create-checkout', {
			method: 'POST',
			body: { priceId, tier },
		})

		if (url) {
			window.location.href = url
		}
	}

	const openPortal = async () => {
		const { url } = await $fetch('/api/v1/stripe/portal', {
			method: 'POST',
		})

		if (url) {
			window.location.href = url
		}
	}

	return {
		checkTrial,
		createCheckout,
		openPortal,
	}
}