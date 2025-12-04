import { prisma } from "~~/server/utils/prisma";
import { defineEventHandler, getRouterParam, createError } from "h3";

export default defineEventHandler(async (event) => {
	const projectId = getRouterParam(event, "id");

	if (!projectId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing projectId parameter",
		});
	}

	const routeMessages = await prisma.routeMessage.findMany({
		where: { projectId },
		orderBy: { priority: "desc" },
	});

	return { success: true, routeMessages };
});
