import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const projectId = event.context.params?.id;
	const body = await readBody(event);

	if (!body.name || !body.label) {
		throw createError({ statusCode: 400, statusMessage: "Name and label required" });
	}

	const project = await prisma.project.findFirst({
		where: { id: projectId, profileId: user.id },
	});

	if (!project) {
		throw createError({ statusCode: 404, statusMessage: "Project not found" });
	}

	const type = await prisma.feedbackType.create({
		data: {
			projectId,
			name: body.name,
			label: body.label,
			emoji: body.emoji,
			isDefault: false,
		},
	});

	return type;
});