import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, readBody, createError } from "h3";
import { z } from "zod";
import { updateProfileSchema } from "~~/app/types/profile";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const body = await readBody(event);

	const validatedData = updateProfileSchema.safeParse(body);

	if (!validatedData.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid data.",
			data: validatedData.error.format(),
		});
	}

	if (!validatedData.data || Object.keys(validatedData.data).length === 0) {
		throw createError({
			statusCode: 400,
			statusMessage: "No data provided for update.",
		});
	}

	const updatedProfile = await prisma.profile.update({
		where: { id: user.id },
		data: {
			...validatedData.data,
			updatedAt: new Date(),
		},
	});

	return updatedProfile;
});