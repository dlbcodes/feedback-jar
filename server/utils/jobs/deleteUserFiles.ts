import {
	S3Client,
	ListObjectsV2Command,
	DeleteObjectsCommand,
	type DeleteObjectsCommandInput
} from "@aws-sdk/client-s3"

export async function deleteUserFilesJob(userId: string) {
	const s3 = getS3Client()
	const bucketName = process.env.AWS_BUCKET_NAME
	const prefix = `${userId}/`

	let continuationToken: string | undefined
	let totalDeleted = 0

	try {
		do {
			// List objects (paginated)
			const listCommand = new ListObjectsV2Command({
				Bucket: bucketName,
				Prefix: prefix,
				ContinuationToken: continuationToken,
				MaxKeys: 1000 // Max allowed by S3
			})

			const listResponse = await s3.send(listCommand)

			if (listResponse.Contents && listResponse.Contents.length > 0) {
				// Delete batch
				const objectsToDelete = listResponse.Contents.map(obj => ({
					Key: obj.Key!
				}))

				const deleteCommand = new DeleteObjectsCommand({
					Bucket: bucketName,
					Delete: {
						Objects: objectsToDelete,
						Quiet: true
					}
				})

				const deleteResponse = await s3.send(deleteCommand)
				totalDeleted += deleteResponse.Deleted?.length || 0
			}

			// Check if there are more files
			continuationToken = listResponse.NextContinuationToken

		} while (continuationToken)

		console.log(`Job completed: Deleted ${totalDeleted} files for user ${userId}`)
		return { success: true, deletedCount: totalDeleted }

	} catch (error) {
		console.error('Background job failed:', error)
		return { success: false, error: (error as Error).message }
	}
}