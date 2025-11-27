import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event)

	try {
		const client = await serverSupabaseClient(event)

		const user2 = await serverSupabaseUser(event)

		// Step 1: Delete user's files from S3
		console.log(`Deleting S3 files for user ${user.id}...`)
		const s3Result = await deleteUserFilesFromS3(user.id)

		if (s3Result.success) {
			console.log(`Successfully deleted ${s3Result.deletedCount} files from S3`)
		} else {
			console.error('S3 deletion had errors:', s3Result.errors)
			// Continue with account deletion even if S3 fails
			// You might want to log this for manual cleanup
		}

		// Step 2: Delete user's profile data from database
		const { error: profileError } = await client
			.from('profiles')
			.delete()
			.eq('id', user.id)

		if (profileError) {
			console.error('Failed to delete profile:', profileError)
			throw createError({
				statusCode: 500,
				message: 'Failed to delete profile data'
			})
		}

		console.log(user.id)
		console.log(user2)

		// Step 3: Delete the auth user (this will cascade delete related data)
		// const { error: deleteError } = await client.auth.admin.deleteUser(user.id, true)

		// if (deleteError) {
		// 	console.error('Failed to delete user:', deleteError)
		// 	throw createError({
		// 		statusCode: 500,
		// 		message: 'Failed to delete account on supabase'
		// 	})
		// }

		return {
			success: true,
			message: 'Account deleted successfully',
			filesDeleted: s3Result.deletedCount
		}

	} catch (error) {
		console.error('Account deletion failed:', error)
		throw createError({
			statusCode: 500,
			message: (error as Error).message || 'Failed to delete account'
		})
	}
})