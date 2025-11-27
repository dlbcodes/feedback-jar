import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const { id: projectId, feedbackId } = event.context.params || {};

	// Verify feedback belongs to user's project
	const feedback = await prisma.feedback.findFirst({
		where: {
			id: feedbackId,
			projectId,
			project: { profileId: user.id },
		},
	});

	if (!feedback) {
		throw createError({
			statusCode: 404,
			statusMessage: "Feedback not found"
		});
	}

	// Fetch comments
	const comments = await prisma.feedbackComment.findMany({
		where: { feedbackId },
		include: {
			author: {
				select: {
					id: true,
					name: true,
					avatar: true,
				}
			},
		},
		orderBy: { createdAt: 'asc' }, // chronological order
	});

	return { comments };
});