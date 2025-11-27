import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, getQuery, createError } from "h3";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const projectId = event.context.params?.id;

	if (!projectId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Project ID is required.",
		});
	}

	// Verify the project belongs to the authenticated user
	const project = await prisma.project.findFirst({
		where: {
			id: projectId,
			profileId: user.id,
		},
	});

	if (!project) {
		throw createError({
			statusCode: 404,
			statusMessage: "Project not found or access denied.",
		});
	}

	// Get query parameters
	const query = getQuery(event);
	const page = parseInt(query.page as string) || 1;
	const limit = parseInt(query.limit as string) || 20;
	const status = query.status as string;
	const type = query.type as string;
	const search = query.search as string;
	const sortBy = (query.sortBy as string) || "createdAt";
	const sortOrder = (query.sortOrder as string) || "desc";

	// Build where clause
	const where: any = {
		projectId: projectId,
	};

	if (status) {
		where.status = status;
	}

	if (type) {
		where.type = type;
	}

	if (search) {
		where.OR = [
			{ message: { contains: search, mode: "insensitive" } },
			{ email: { contains: search, mode: "insensitive" } },
		];
	}

	// Calculate skip
	const skip = (page - 1) * limit;

	// Get total count
	const total = await prisma.feedback.count({ where });

	// Get feedback with pagination
	const feedbacks = await prisma.feedback.findMany({
		where,
		skip,
		take: limit,
		orderBy: {
			[sortBy]: sortOrder,
		},
		select: {
			id: true,
			message: true,
			email: true,
			type: true,
			status: true,
			screenshotUrl: true,
			pageUrl: true,
			browser: true,
			browserVersion: true,
			os: true,
			deviceType: true,
			viewportWidth: true,
			viewportHeight: true,
			devicePixelRatio: true,
			userAgent: true,
			sessionId: true,
			userId: true,
			metadata: true,
			customFields: true,
			assignedTo: true,
			notes: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	// Calculate pagination metadata
	const totalPages = Math.ceil(total / limit);
	const hasNextPage = page < totalPages;
	const hasPrevPage = page > 1;

	return {
		feedbacks,
		pagination: {
			page,
			limit,
			total,
			totalPages,
			hasNextPage,
			hasPrevPage,
		},
		filters: {
			status,
			type,
			search,
			sortBy,
			sortOrder,
		},
	};
});