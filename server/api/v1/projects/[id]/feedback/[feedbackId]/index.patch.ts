import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const { id: projectId, feedbackId } = event.context.params || {};
	const body = await readBody(event);

	// Verify ownership
	const existing = await prisma.feedback.findFirst({
		where: {
			id: feedbackId,
			projectId,
			project: { profileId: user.id },
		},
	});

	if (!existing) {
		throw createError({ statusCode: 404, statusMessage: "Feedback not found" });
	}

	const feedback = await prisma.feedback.update({
		where: { id: feedbackId },
		data: {
			status: body.status,
			assignedToId: body.assignedToId,
		},
		include: {
			type: true,
			assignedTo: { select: { id: true, name: true } },
		},
	});

	return feedback;
});
