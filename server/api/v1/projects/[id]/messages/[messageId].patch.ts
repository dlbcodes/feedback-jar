import { prisma } from "~~/server/utils/prisma";
import { defineEventHandler, readBody, getRouterParam, createError } from "h3";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "messageId");
	const projectId = getRouterParam(event, "id");
	const body = await readBody(event);

	if (!id || !projectId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing route message ID or projectId",
		});
	}

	if (body.matchType) {
		const validMatchTypes = ["exact", "startsWith", "contains"];
		if (!validMatchTypes.includes(body.matchType)) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid matchType. Must be: exact, startsWith, or contains",
			});
		}
	}

	try {
		const routeMessage = await prisma.routeMessage.update({
			where: { id },
			data: {
				...(body.route && { route: body.route }),
				...(body.message && { message: body.message }),
				...(body.matchType && { matchType: body.matchType }),
				...(body.priority !== undefined && { priority: body.priority }),
				...(body.isActive !== undefined && { isActive: body.isActive }),
			},
		});

		return { success: true, routeMessage };
	} catch (error: any) {
		if (error.code === "P2025") {
			throw createError({
				statusCode: 404,
				statusMessage: "Route message not found",
			});
		}
		if (error.code === "P2002") {
			throw createError({
				statusCode: 409,
				statusMessage: "A route message for this route already exists",
			});
		}
		throw error;
	}
});
