import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const { id: projectId, feedbackId } = event.context.params || {};

	const feedback = await prisma.feedback.findFirst({
		where: {
			id: feedbackId,
			projectId,
			project: { profileId: user.id },
		},
		include: {
			type: true,
			assignedTo: { select: { id: true, name: true } },
			comments: {
				include: {
					author: { select: { id: true, name: true } },
				},
				orderBy: { createdAt: "asc" },
			},
		},
	});

	if (!feedback) {
		throw createError({ statusCode: 404, statusMessage: "Feedback not found" });
	}

	return feedback;
});