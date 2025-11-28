export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const body = await readBody(event);

	if (!body.name) {
		throw createError({ statusCode: 400, statusMessage: "Project name is required." });
	}

	const defaultTypes = [
		{ name: "bug", label: "Bug Report", emoji: "🐛", isDefault: true },
		{ name: "feedback", label: "Feedback", emoji: "💡", isDefault: true },
		{ name: "help", label: "Help Request", emoji: "❓", isDefault: true },
	];

	const projectWithTypes = await prisma.$transaction(async (prismaTx) => {
		const project = await prismaTx.project.create({
			data: {
				name: body.name,
				timezone: body.timezone,
				domain: body.domain,
				profileId: user.id,
			},
		});

		await prismaTx.feedbackType.createMany({
			data: defaultTypes.map(t => ({ ...t, projectId: project.id })),
		});

		return project;
	});

	return projectWithTypes;
});
