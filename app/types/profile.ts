import { z } from "zod";
import type { Profile as PrismaProfile } from "@prisma/client";

export type Profile = PrismaProfile;

export const updateProfileSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	avatar: z.string().min(1).nullable().optional(),
	notifications: z.record(z.string(), z.any()).nullable().optional(),
});

// TypeScript types derived from Zod schemas
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

// API Response types
export interface ApiResponse<T> {
	data?: T;
	profile?: Profile;
	message?: string;
}

export interface ApiErrorResponse {
	statusCode: number;
	statusMessage: string;
	data?: any;
}