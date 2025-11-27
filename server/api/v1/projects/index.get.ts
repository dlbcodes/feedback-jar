import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);

	const projects = await prisma.project.findMany({
		where: { profileId: user.id },
		include: { feedbacks: { take: 5, orderBy: { createdAt: "desc" } } },
		orderBy: { createdAt: "asc" },
	});

	return projects;
});
