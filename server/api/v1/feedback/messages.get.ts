import { prisma } from "~~/server/utils/prisma";
import { defineEventHandler, getQuery, createError } from "h3";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const scriptKey = query.script_key as string;
	const currentRoute = query.route as string;

	if (!scriptKey) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing script_key parameter"
		});
	}

	const project = await prisma.project.findUnique({
		where: { scriptKey },
		include: {
			routeMessages: {
				where: { isActive: true },
				orderBy: { priority: 'desc' }
			}
		},
	});

	if (!project) {
		throw createError({
			statusCode: 404,
			statusMessage: "Invalid script key"
		});
	}

	// If no route provided, return all route messages
	if (!currentRoute) {
		return {
			success: true,
			messages: project.routeMessages.map(rm => ({
				route: rm.route,
				message: rm.message,
				messageHtml: rm.messageHtml,
				messageType: rm.messageType,
				builderData: rm.builderData,
				displayType: rm.displayType,
				theme: rm.theme,
				matchType: rm.matchType,
				priority: rm.priority,
				dismissable: rm.dismissable
			}))
		};
	}

	// Find matching route message based on match type
	let matchedMessage = null;

	for (const routeMsg of project.routeMessages) {
		let isMatch = false;

		switch (routeMsg.matchType) {
			case 'exact':
				isMatch = currentRoute === routeMsg.route;
				break;
			case 'startsWith':
				isMatch = currentRoute.startsWith(routeMsg.route);
				break;
			case 'contains':
				isMatch = currentRoute.includes(routeMsg.route);
				break;
		}

		if (isMatch) {
			matchedMessage = {
				route: routeMsg.route,
				message: routeMsg.message,
				matchType: routeMsg.matchType
			};
			break; // Stop at first match (highest priority)
		}
	}

	return {
		success: true,
		message: matchedMessage
	};
});