import { prisma } from "~~/server/utils/prisma";
import { defineEventHandler, getRouterParam, createError } from "h3";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "messageId");
	const projectId = getRouterParam(event, "id");

	if (!id || !projectId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing route message ID or projectId",
		});
	}

	try {
		await prisma.routeMessage.delete({
			where: { id },
		});

		return { success: true, message: "Route message deleted successfully" };
	} catch (error: any) {
		if (error.code === "P2025") {
			throw createError({
				statusCode: 404,
				statusMessage: "Route message not found",
			});
		}
		throw error;
	}
});
