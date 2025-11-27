
// composables/useFileUpload.ts - Generic file upload composable
export interface UploadResult {
	fileName: string
	publicUrl: string
	fileSize: number
}

export const useFileUpload = () => {
	const uploading = ref(false)
	const uploadProgress = ref(0)

	const uploadFile = async (
		file: File,
		type: string,
		maxSizeMB: number = 5
	): Promise<UploadResult> => {
		if (!file) {
			throw new Error('No file provided')
		}

		// Validate file
		if (!file.type.startsWith('image/')) {
			throw new Error('File must be an image')
		}

		if (file.size > maxSizeMB * 1024 * 1024) {
			throw new Error(`File too large. Maximum size is ${maxSizeMB}MB`)
		}

		uploading.value = true
		uploadProgress.value = 0

		try {
			// Step 1: Get presigned URL
			const { data } = await $fetch('/api/v1/upload/presigned-url', {
				method: 'POST',
				body: {
					type,
					contentType: file.type,
					fileSize: file.size
				}
			})

			if (!data.presignedUrl) {
				throw new Error('Failed to get upload URL')
			}

			uploadProgress.value = 25

			// Step 2: Upload file directly to S3
			const uploadResponse = await fetch(data.presignedUrl, {
				method: 'PUT',
				body: file,
				headers: {
					'Content-Type': file.type,
				},
			})

			if (!uploadResponse.ok) {
				throw new Error(`Upload failed: ${uploadResponse.statusText}`)
			}

			uploadProgress.value = 100

			// Return upload result - let caller handle what to do with it
			return {
				fileName: data.fileName,
				publicUrl: data.publicUrl,
				fileSize: file.size
			}

		} catch (error) {
			console.error('Upload failed:', error)
			throw error
		} finally {
			uploading.value = false
			uploadProgress.value = 0
		}
	}

	return {
		uploading: readonly(uploading),
		uploadProgress: readonly(uploadProgress),
		uploadFile
	}
}