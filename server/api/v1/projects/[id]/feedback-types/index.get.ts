import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const projectId = event.context.params?.id;

	const project = await prisma.project.findFirst({
		where: { id: projectId, profileId: user.id },
	});

	if (!project) {
		throw createError({ statusCode: 404, statusMessage: "Project not found" });
	}

	const types = await prisma.feedbackType.findMany({
		where: { projectId },
		orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
	});

	return types;
});