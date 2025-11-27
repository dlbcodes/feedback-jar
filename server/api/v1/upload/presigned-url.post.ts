import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event)

	const body = await readBody(event)
	const { type, contentType, fileSize } = body

	// Validate input
	if (!type || !["avatar", "cover"].includes(type)) {
		throw createError({
			statusCode: 400,
			message: "Invalid type. Must be 'avatar' or 'cover'"
		})
	}

	if (!contentType || !contentType.startsWith('image/')) {
		throw createError({
			statusCode: 400,
			message: "Invalid content type. Must be an image"
		})
	}

	if (fileSize && fileSize > 5 * 1024 * 1024) { // 5MB limit
		throw createError({
			statusCode: 400,
			message: "File too large. Maximum size is 5MB"
		})
	}

	try {
		const s3 = getS3Client()

		// Step 1: Get current avatar/cover from database to delete old file
		const profile = await prisma.profile.findUnique({
			where: { id: user.id },
			select: {
				avatar: true,
			}
		})

		if (!profile) {
			console.error('Failed to fetch profile')
		}

		// Step 2: Delete old file if it exists
		if (profile) {
			const oldFileName = type === 'avatar' ? profile.avatar : ""

			if (oldFileName) {
				const oldFileKey = `${user.id}/${type}/${oldFileName}`
				await deleteS3File(oldFileKey)
			}
		}

		// Step 3: Generate unique filename for new upload
		const timestamp = Date.now()
		const randomId = Math.random().toString(36).substring(2, 15)
		const fileExtension = contentType.split('/')[1] || 'jpg'
		const fileName = `${timestamp}-${randomId}.${fileExtension}`
		const fileKey = `${user.id}/${type}/${fileName}`

		// Step 4: Create S3 command for upload
		const command = new PutObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: fileKey,
			ContentType: contentType,
			CacheControl: "max-age=31536000", // 1 year
			Metadata: {
				userId: user.id,
				uploadType: type,
				timestamp: timestamp.toString()
			}
		})

		// Step 5: Generate presigned URL (expires in 5 minutes)
		const presignedUrl = await getSignedUrl(s3, command, {
			expiresIn: 300
		})

		// CloudFront URL for serving
		const publicUrl = `${process.env.CLOUDFRONT_URL}/${fileKey}`

		return {
			success: true,
			data: {
				presignedUrl,
				fileKey,
				fileName,
				publicUrl,
				expiresIn: 300
			}
		}

	} catch (error) {
		console.error('Failed to generate presigned URL:', error)
		throw createError({
			statusCode: 500,
			message: "Failed to generate upload URL"
		})
	}
})