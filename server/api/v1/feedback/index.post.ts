import { prisma } from "~~/server/utils/prisma";
import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	if (!body.script_key || !body.message || !body.email) {
		throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
	}

	const project = await prisma.project.findUnique({
		where: { scriptKey: body.script_key },
		include: { feedbackTypes: true },
	});

	if (!project) {
		throw createError({ statusCode: 404, statusMessage: "Invalid script key" });
	}

	// Find or use default feedback type
	const typeName = body.custom_fields?.type || "feedback";
	let feedbackType = project.feedbackTypes.find(t => t.name === typeName);

	if (!feedbackType) {
		feedbackType = project.feedbackTypes.find(t => t.isDefault);
	}

	if (!feedbackType) {
		throw createError({ statusCode: 400, statusMessage: "Invalid feedback type" });
	}

	const feedback = await prisma.feedback.create({
		data: {
			projectId: project.id,
			typeId: feedbackType.id,
			message: body.message,
			email: body.email,
			screenshotUrl: body.screenshot_url,
			pageUrl: body.page_url,
			browser: body.browser,
			browserVersion: body.browser_version,
			os: body.os,
			deviceType: body.device_type,
			viewportWidth: body.viewport_width,
			viewportHeight: body.viewport_height,
			devicePixelRatio: body.device_pixel_ratio,
			userAgent: body.user_agent,
			sessionId: body.session_id,
			userId: body.user_id,
			metadata: body.metadata || {},
			customFields: body.custom_fields || {},
			status: "new",
		},
	});

	return { success: true, id: feedback.id };
});