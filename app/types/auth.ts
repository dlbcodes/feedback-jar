import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, { message: "Password is required" }),
	name: z.string().min(1, { message: "Name is required" }),
	username: z.string().min(1, { message: "Name is required" }).optional(),
});

export const resetSchema = z.object({
	email: z.string().email(),
});

export const recoverSchema = z.object({
	password: z.string().min(1, { message: "Password is required" }),
});

export const profileSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	email: z.string().email(),
});

export const passwordSchema = z.object({
	// old_password: z.string().min(1, { message: "Password is required" }),
	// new_password: z.string().min(1, { message: "Password is required" }),
	password: z.string().min(6, { message: "Password is required" }),
});

export const waitlistSchema = z.object({
	email: z.string().email(),
	name: z.string().min(1, { message: "Name is required" }),
});

export const userSettingsSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, { message: "Password is required" }),
	name: z.string().min(1, { message: "Name is required" }),
	username: z.string().min(1, { message: "Name is required" }).optional(),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
export type registerSchemaType = z.infer<typeof registerSchema>;
export type resetSchemaType = z.infer<typeof resetSchema>;
export type profileSchemaType = z.infer<typeof profileSchema>;
export type waitlistSchemaType = z.infer<typeof waitlistSchema>;
export type passwordSchemaType = z.infer<typeof passwordSchema>;
export type recoverSchemaType = z.infer<typeof recoverSchema>;
export type userSettingsSchemaType = z.infer<typeof userSettingsSchema>;
