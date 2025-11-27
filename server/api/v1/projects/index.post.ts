import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const body = await readBody(event);

	if (!body.name) {
		throw createError({ statusCode: 400, statusMessage: "Project name is required." });
	}

	const project = await prisma.project.create({
		data: {
			name: body.name,
			timezone: body.timezone,
			domain: body.domain,
			profileId: user.id,
		},
	});

	return project;
});
