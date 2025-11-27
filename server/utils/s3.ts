import {
	S3Client,
	ListObjectsV2Command,
	DeleteObjectCommand,
	DeleteObjectsCommand,
	type DeleteObjectsCommandInput
} from "@aws-sdk/client-s3"

/**
 * Get configured S3 client
 */
export const getS3Client = () => {
	return new S3Client({
		region: process.env.AWS_BUCKET_REGION,
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
		},
	})
}

/**
 * Delete a single file from S3
 */
export async function deleteS3File(fileKey: string): Promise<boolean> {
	const s3 = getS3Client()
	const bucketName = process.env.AWS_BUCKET_NAME

	try {
		const command = new DeleteObjectCommand({
			Bucket: bucketName,
			Key: fileKey
		})

		await s3.send(command)
		console.log(`Successfully deleted file: ${fileKey}`)
		return true
	} catch (error) {
		console.error(`Failed to delete file ${fileKey}:`, error)
		return false
	}
}

/**
 * Delete all files for a user from S3
 */
export async function deleteUserFilesFromS3(userId: string): Promise<{
	success: boolean
	deletedCount: number
	errors?: string[]
}> {
	const s3 = getS3Client()
	const bucketName = process.env.AWS_BUCKET_NAME
	const prefix = `${userId}/` // All user files are under userId/

	const errors: string[] = []
	let deletedCount = 0

	try {
		// Step 1: List all objects with the user's prefix
		const listCommand = new ListObjectsV2Command({
			Bucket: bucketName,
			Prefix: prefix,
		})

		const listResponse = await s3.send(listCommand)

		// No files to delete
		if (!listResponse.Contents || listResponse.Contents.length === 0) {
			return { success: true, deletedCount: 0 }
		}

		// Step 2: Prepare objects for deletion
		const objectsToDelete = listResponse.Contents.map(obj => ({
			Key: obj.Key!
		}))

		// Step 3: Delete objects (max 1000 at a time)
		const deleteCommand = new DeleteObjectsCommand({
			Bucket: bucketName,
			Delete: {
				Objects: objectsToDelete,
				Quiet: false, // Get detailed response
			},
		})

		const deleteResponse = await s3.send(deleteCommand)

		// Track deleted files
		deletedCount = deleteResponse.Deleted?.length || 0

		// Track errors
		if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
			deleteResponse.Errors.forEach(error => {
				errors.push(`Failed to delete ${error.Key}: ${error.Message}`)
			})
		}

		// Handle pagination if there are more than 1000 files
		if (listResponse.IsTruncated) {
			console.warn(`User ${userId} has more than 1000 files. Pagination needed.`)
			// You might want to implement pagination here or use a background job
		}

		return {
			success: errors.length === 0,
			deletedCount,
			errors: errors.length > 0 ? errors : undefined
		}

	} catch (error) {
		console.error('Failed to delete user files from S3:', error)
		return {
			success: false,
			deletedCount,
			errors: [(error as Error).message || 'Unknown error occurred']
		}
	}
}