import { defineEventHandler, readBody, createError } from "h3";
import { requireAuthUser } from "~~/server/utils/auth";
import { resend } from "~~/server/utils/resend";
import { sendEmailSchema } from "~~/app/types/email";
import { emailTemplates } from '~~/server/emails'
import { email } from "zod";

export default defineEventHandler(async (event) => {
	// Require authentication
	const user = await requireAuthUser(event);

	// Read and validate request body
	const body = await readBody(event);
	const validation = sendEmailSchema.safeParse(body);

	console.log(validation)

	if (!validation.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid email data",
			data: validation.error.format(),
		});
	}

	const { to, subject, html, text, replyTo, template } = validation.data;

	// Merge user into variables
	const variables = {
		...(validation.data.variables || {}),
		user, // pass authenticated user info to the email template
	};

	// Ensure at least html or text is provided
	if (!html && !text && !template) {
		throw createError({
			statusCode: 400,
			statusMessage: "Either html or text content is required",
		});
	}


	const templateFn = emailTemplates[template as keyof typeof emailTemplates]
	if (!templateFn) {
		throw createError({ statusCode: 404, message: `Template "${template}" not found` })
	}

	// Pass variables to the function dynamically
	const emailTemplate = templateFn({ ...(variables || {}), user })

	console.log(emailTemplate)

	try {
		// return

		// Send email via Resend
		const { data, error } = await resend.emails.send({
			from: 'Graphiqo Team <hello@updates.graphiqo.app>',
			to: to,
			subject: subject,
			html: emailTemplate,
			text,
			replyTo,
		});

		if (error) {
			console.error("Resend error:", error);
			throw createError({
				statusCode: 500,
				statusMessage: "Failed to send email",
				data: error,
			});
		}

		return {
			id: data?.id,
			success: true,
			message: "Email sent successfully",
		};
	} catch (error: any) {
		console.error("Email sending error:", error);
		throw createError({
			statusCode: 500,
			statusMessage: error.message || "Failed to send email",
		});
	}
});