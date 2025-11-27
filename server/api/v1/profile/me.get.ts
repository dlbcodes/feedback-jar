import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);

	const profile = await prisma.profile.findUnique({
		where: { id: user.id },
	});

	if (!profile) {
		throw createError({
			statusCode: 404,
			statusMessage: "Profile not found.",
		});
	}

	return profile;
});