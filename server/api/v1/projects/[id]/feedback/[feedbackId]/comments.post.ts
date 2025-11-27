import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const { id: projectId, feedbackId } = event.context.params || {};
	const body = await readBody(event);

	if (!body.content) {
		throw createError({ statusCode: 400, statusMessage: "Content is required" });
	}

	// Verify feedback belongs to user's project
	const feedback = await prisma.feedback.findFirst({
		where: {
			id: feedbackId,
			projectId,
			project: { profileId: user.id },
		},
	});

	if (!feedback) {
		throw createError({ statusCode: 404, statusMessage: "Feedback not found" });
	}

	const comment = await prisma.feedbackComment.create({
		data: {
			feedbackId,
			authorId: user.id,
			content: body.content,
			isInternal: body.isInternal ?? true,
		},
		include: {
			author: { select: { id: true, name: true } },
		},
	});

	return comment;
});