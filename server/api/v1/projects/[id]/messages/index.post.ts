import { prisma } from "~~/server/utils/prisma";
import { defineEventHandler, readBody, getRouterParam, createError } from "h3";

export default defineEventHandler(async (event) => {
	const projectId = getRouterParam(event, "id");
	const body = await readBody(event);

	console.log(body);
	console.log(projectId);

	if (!projectId || !body.route) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing required fields: projectId (from URL), route",
		});
	}

	const validMatchTypes = ["exact", "startsWith", "contains", "regex"];
	if (body.matchType && !validMatchTypes.includes(body.matchType)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid matchType. Must be: exact, startsWith, contains, or regex",
		});
	}

	// You may want to enforce message or builderData presence
	if (
		!body.message &&
		!body.messageHtml &&
		!(body.builderData && body.messageType === "builder")
	) {
		throw createError({
			statusCode: 400,
			statusMessage: "At least one of message, messageHtml, or builderData must be provided",
		});
	}

	try {
		const routeMessage = await prisma.routeMessage.create({
			data: {
				projectId,
				route: body.route,
				message: body.message || "", // fallback to empty string if not provided
				messageHtml: body.messageHtml || null,
				messageType: body.messageType || "text",
				builderData: body.builderData || null,
				displayType: body.displayType || "popover",
				theme: body.theme || null,
				matchType: body.matchType || "exact",
				priority: body.priority ?? 0,
				isActive: body.isActive ?? true,
			},
		});

		return { success: true, routeMessage };
	} catch (error: any) {
		if (error.code === "P2002") {
			throw createError({
				statusCode: 409,
				statusMessage: "A route message for this route already exists",
			});
		}
		throw error;
	}
});
