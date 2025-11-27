import { z } from "zod";

export const sendEmailSchema = z.object({
	to: z.union([
		z.string().email(),
		z.array(z.string().email())
	]),
	subject: z.string().min(1).max(255),
	html: z.string().min(1).optional(),
	text: z.string().min(1).optional(),
	replyTo: z.string().email().optional(),
	template: z.string().optional(),
	variables: z.record(z.string(), z.any()).optional()
});

export type SendEmailDto = z.infer<typeof sendEmailSchema>;

export interface EmailResponse {
	id: string;
	success: boolean;
	message?: string;
}