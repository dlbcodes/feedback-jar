// plugins/init.auth.ts
import { useProfileStore } from '~/stores/profileStore'
import { useRouter } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
	const supabase = useSupabaseClient()
	const profileStore = useProfileStore()
	const router = useRouter()

	console.log('📌 Initializing Auth Plugin')

	let isInitialized = false

	// Clear profile store
	const clearProfileStore = () => {
		console.log('🧹 Clearing profile store')
		profileStore.clearAll()
		isInitialized = false
	}

	// Initialize profile store with user data
	const initializeProfile = async (user: any, source: string) => {
		if (isInitialized) {
			console.log(`⏭️ Already initialized, skipping ${source}`)
			return
		}

		console.log(`🚀 Initializing profile from ${source} for user:`, user?.id)

		try {
			profileStore.setUser(user)

			if (user) {
				const success = await profileStore.fetchProfile()
				if (!success) console.warn(`⚠️ Failed to fetch profile from ${source}`)
			}

			isInitialized = true
			console.log(`✅ Profile initialization completed from ${source}`)
		} catch (err) {
			console.error(`❌ Error during profile initialization from ${source}:`, err)
			clearProfileStore()
		}
	}

	// Handle auth state changes
	supabase.auth.onAuthStateChange(async (event, session) => {
		console.log('🔄 Auth state changed:', event)

		try {
			if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
				if (session?.user) await initializeProfile(session.user, `AUTH_EVENT_${event}`)
			} else if (event === 'INITIAL_SESSION') {
				if (session?.user) await initializeProfile(session.user, 'INITIAL_SESSION')
				else clearProfileStore()
			} else if (event === 'SIGNED_OUT') {
				console.log('🚪 User signed out')
				clearProfileStore()
				await router.push('/login')
			} else if (event === 'USER_UPDATED') {
				console.log('📝 User updated')
				if (session?.user) {
					profileStore.setUser(session.user)
					await profileStore.fetchProfile()
				}
			}
		} catch (err) {
			console.error(`❌ Error during "${event}" event:`, err)
			clearProfileStore()
		}
	})
})
