// import type { Profile, UpdateProfileDto, ApiResponse } from "~~/types/profile";
// import { updateProfileSchema } from "~~/types/profile";

import type { Profile, UpdateProfileDto, ApiResponse } from "~/types/profile"

// /**
//  * Data Transfer Objects (DTOs) for type safety
//  */
// export interface Profile {
// 	id: string
// 	userId: string
// 	email?: string
// 	name?: string
// 	avatar?: string
// 	bio?: string
// 	createdAt: string
// 	updatedAt: string
// 	[key: string]: any // For additional profile fields
// }

// export interface UpdateProfileDto {
// 	name?: string
// 	avatar?: string
// 	bio?: string
// 	[key: string]: any // For additional updatable fields
// }

// /**
//  * API Response interfaces
//  */
// interface ApiResponse<T> {
// 	data?: T
// 	profile?: Profile
// 	message?: string
// 	error?: string
// }

/**
 * Custom error class for API errors
 */
export class ProfileApiError extends Error {
	public readonly statusCode?: number
	public readonly originalError?: any

	constructor(message: string, statusCode?: number, originalError?: any) {
		super(message)
		this.name = 'ProfileApiError'
		this.statusCode = statusCode
		this.originalError = originalError
	}
}

/**
 * Simple Profile API service
 */
export class ProfileApiService {
	private readonly baseUrl: string

	constructor(baseUrl: string = "/api/v1/profile") {
		this.baseUrl = baseUrl
	}

	/**
	 * Fetch the authenticated user's profile
	 */
	async getMe(): Promise<Profile> {
		try {
			const response = await $fetch<ApiResponse<Profile>>(`${this.baseUrl}/me`)

			const profile = response.profile || response.data || response

			if (!profile || typeof profile !== 'object') {
				throw new ProfileApiError('Invalid profile response')
			}

			return profile as Profile
		} catch (error) {
			throw this._handleError(error, 'Failed to fetch profile')
		}
	}

	/**
	 * Update the authenticated user's profile
	 */
	async updateMe(updates: UpdateProfileDto): Promise<Profile> {
		this._validateUpdateInput(updates)

		try {
			const response = await $fetch<ApiResponse<Profile>>(`${this.baseUrl}/me`, {
				method: 'PATCH',
				body: updates
			})

			const profile = response.profile || response.data || response

			if (!profile) {
				throw new ProfileApiError('Failed to update profile')
			}

			return profile as Profile
		} catch (error) {
			throw this._handleError(error, 'Failed to update profile')
		}
	}

	/**
 * Delete the authenticated user's account
 */
	async deleteAccount(): Promise<void> {
		try {
			await $fetch(`${this.baseUrl}/me`, {
				method: 'DELETE'
			})
		} catch (error) {
			throw this._handleError(error, 'Failed to delete account')
		}
	}

	/**
	 * Private error handler
	 */
	private _handleError(error: any, fallbackMessage: string): ProfileApiError {
		const message = error?.data?.message || error?.message || fallbackMessage
		const statusCode = error?.status || error?.statusCode

		console.error('ProfileApiService Error:', {
			message,
			statusCode,
			originalError: error
		})

		return new ProfileApiError(message, statusCode, error)
	}

	/**
	 * Validate update input
	 */
	private _validateUpdateInput(data: UpdateProfileDto): void {
		if (Object.keys(data).length === 0) {
			throw new ProfileApiError('At least one field must be updated')
		}

		if (data.name !== undefined && (!data.name || data.name.trim().length === 0)) {
			throw new ProfileApiError('Name cannot be empty')
		}

		if (data.name && data.name.length > 100) {
			throw new ProfileApiError('Name must be 100 characters or less')
		}
	}
}

/**
 * Singleton instance
 */
export const profileApiService = new ProfileApiService()

/**
 * Factory function for custom configurations
 */
export function createProfileApiService(baseUrl?: string): ProfileApiService {
	return new ProfileApiService(baseUrl)
}