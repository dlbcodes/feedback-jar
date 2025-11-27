// server/api/waitlist.post.ts
import { prisma } from '~~/server/utils/prisma';
import { waitlistSchema } from '~/types/auth';

export default defineEventHandler(async (event) => {
	try {
		// Parse and validate the request body
		const body = await readBody(event);

		// Validate with your schema
		const validationResult = waitlistSchema.safeParse(body);

		if (!validationResult.success) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Validation failed',
				data: validationResult.error.flatten().fieldErrors,
			});
		}

		const { name, email } = validationResult.data;

		// Check if email already exists
		const existingEntry = await prisma.waitlist.findUnique({
			where: { email },
		});

		if (existingEntry) {
			throw createError({
				statusCode: 409,
				statusMessage: 'Email already registered',
				data: { email: 'This email is already on the waitlist' },
			});
		}

		// Create new waitlist entry
		const waitlistEntry = await prisma.waitlist.create({
			data: {
				name,
				email,
			},
		});

		// Optional: Send welcome email here
		// await sendWaitlistEmail(email, name);

		return {
			success: true,
			message: 'Successfully joined the waitlist',
			data: {
				id: waitlistEntry.id,
				createdAt: waitlistEntry.createdAt,
			},
		};
	} catch (error: any) {
		// Handle Prisma errors
		if (error.code === 'P2002') {
			throw createError({
				statusCode: 409,
				statusMessage: 'Email already registered',
			});
		}

		// Re-throw if it's already a createError
		if (error.statusCode) {
			throw error;
		}

		// Generic error
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal server error',
			data: error.message,
		});
	}
});