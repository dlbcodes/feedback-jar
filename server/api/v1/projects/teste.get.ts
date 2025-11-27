import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, getRouterParam, createError } from "h3";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const projectId = getRouterParam(event, "id");

	if (!projectId) {
		throw createError({ statusCode: 400, statusMessage: "Project ID is required." });
	}

	const project = await prisma.project.findUnique({
		where: { id: projectId },
		include: { analytics: { take: 10, orderBy: { timestamp: "desc" } } },
	});

	if (!project) {
		throw createError({ statusCode: 404, statusMessage: "Project not found." });
	}

	// Ensure the project belongs to the authenticated user
	if (project.profileId !== user.id) {
		throw createError({ statusCode: 403, statusMessage: "Access denied." });
	}

	return project;
});