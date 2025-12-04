import { prisma } from "~~/server/utils/prisma";
import { defineEventHandler, getQuery, createError } from "h3";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const scriptKey = query.script_key as string;

	if (!scriptKey) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing script_key parameter"
		});
	}

	const project = await prisma.project.findUnique({
		where: { scriptKey },
		include: {
			feedbackTypes: {
				orderBy: [
					{ isDefault: 'desc' },
					{ createdAt: 'asc' }
				]
			}
		},
	});

	if (!project) {
		throw createError({
			statusCode: 404,
			statusMessage: "Invalid script key"
		});
	}

	return {
		success: true,
		types: project.feedbackTypes.map(type => ({
			name: type.name,
			label: type.label,
			emoji: type.emoji,
			isDefault: type.isDefault
		}))
	};
});