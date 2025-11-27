import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, getQuery, createError } from "h3";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const projectId = event.context.params?.id;

	const project = await prisma.project.findFirst({
		where: { id: projectId, profileId: user.id },
	});

	if (!project) {
		throw createError({ statusCode: 404, statusMessage: "Project not found" });
	}

	const query = getQuery(event);
	const page = parseInt(query.page as string) || 1;
	const limit = parseInt(query.limit as string) || 20;
	const skip = (page - 1) * limit;

	const where: any = { projectId };

	if (query.status) where.status = query.status;
	if (query.typeId) where.typeId = query.typeId;
	if (query.assignedToId) where.assignedToId = query.assignedToId;
	if (query.search) {
		where.OR = [
			{ message: { contains: query.search as string, mode: "insensitive" } },
			{ email: { contains: query.search as string, mode: "insensitive" } },
		];
	}

	const [feedbacks, total] = await Promise.all([
		prisma.feedback.findMany({
			where,
			skip,
			take: limit,
			orderBy: { createdAt: "desc" },
			include: {
				type: true,
				assignedTo: { select: { id: true, name: true } },
				_count: { select: { comments: true } },
			},
		}),
		prisma.feedback.count({ where }),
	]);

	return {
		feedbacks,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
});