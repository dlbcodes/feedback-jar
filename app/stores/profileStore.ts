// stores/profileStore.ts
import { defineStore } from 'pinia'
import { useToast } from '@/composables/useToast'
import { type User } from "@supabase/supabase-js"
import {
	profileApiService,
	type Profile,
	type UpdateProfileDto,
	ProfileApiError
} from '@/services/ProfileApiService'

/**
 * Profile Store - handles both auth user and profile data
 */
export const useProfileStore = defineStore('profile', () => {
	const { addToast } = useToast()

	// ========================================
	// STATE
	// ========================================
	const user = ref<User | null>(null)
	const profile = ref<Profile | null>(null)
	const loading = ref(false)
	const error = ref<string | null>(null)

	// ========================================
	// GETTERS
	// ========================================
	const isAuthenticated = computed(() => !!user.value)
	const hasProfile = computed(() => !!profile.value)
	const isLoading = computed(() => loading.value)

	// ========================================
	// ACTIONS
	// ========================================

	/**
	 * Fetch authenticated user's profile
	 */
	async function fetchProfile(): Promise<boolean> {
		loading.value = true
		error.value = null

		try {
			const fetchedProfile = await profileApiService.getMe()

			profile.value = fetchedProfile

			return true
		} catch (err) {
			const errorMessage = err instanceof ProfileApiError
				? err.message
				: 'Failed to fetch profile'

			error.value = errorMessage

			addToast(errorMessage, {
				type: 'error',
			})

			return false
		} finally {
			loading.value = false
		}
	}

	/**
	 * Update user's profile
	 */
	async function updateProfile(updates: UpdateProfileDto): Promise<boolean> {
		loading.value = true
		error.value = null

		// Store original for rollback
		const originalProfile = profile.value

		// Optimistic update
		if (profile.value) {
			profile.value = { ...profile.value, ...updates }
		}

		try {
			const updatedProfile = await profileApiService.updateMe(updates)

			profile.value = updatedProfile

			addToast('Profile updated successfully', {
				type: 'success',
			})

			return true
		} catch (err) {
			// Rollback on error
			if (originalProfile) {
				profile.value = originalProfile
			}

			const errorMessage = err instanceof ProfileApiError
				? err.message
				: 'Failed to update profile'

			error.value = errorMessage

			addToast(errorMessage, {
				type: 'error',
			})

			return false
		} finally {
			loading.value = false
		}
	}

	/**
 * Delete user's account permanently
 */
	async function deleteAccount(): Promise<boolean> {
		loading.value = true
		error.value = null

		try {
			await profileApiService.deleteAccount()

			// Clear all local data
			clearAll()

			addToast('Account deleted successfully', {
				type: 'success',
			})

			return true
		} catch (err) {
			const errorMessage = err instanceof ProfileApiError
				? err.message
				: 'Failed to delete account'

			error.value = errorMessage

			addToast(errorMessage, {
				type: 'error',
			})

			return false
		} finally {
			loading.value = false
		}
	}


	/**
	 * Set user (from Supabase auth)
	 */
	function setUser(userData: User | null): void {
		user.value = userData
	}

	/**
	 * Clear all data
	 */
	function clearAll(): void {
		user.value = null
		profile.value = null
		error.value = null
	}

	/**
	 * Set profile directly (for SSR or initial load)
	 */
	function setProfile(profileData: Profile | null): void {
		profile.value = profileData
	}

	// ========================================
	// PUBLIC API
	// ========================================
	return {
		// State
		user: readonly(user),
		profile: readonly(profile),
		loading: readonly(loading),
		error: readonly(error),

		// Getters
		isAuthenticated,
		hasProfile,
		isLoading,

		// Actions
		fetchProfile,
		updateProfile,
		deleteAccount,
		setUser,
		clearAll,
		setProfile
	}
})