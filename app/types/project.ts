import { type Analytics } from "./analytics";
import { z } from "zod";
import type { Project as PrismaProject } from "@prisma/client";

export type Project = PrismaProject;

// Project creation schema
export const createProjectSchema = z.object({
	name: z.string().min(1, { message: "Project name is required" }),
	domain: z
		.string().min(1, { message: "Domain is required" }),
	timezone: z.string().nonempty({ message: "Timezone is required" }),
});


// Type inferred from schema
export type CreateProjectDto = z.infer<typeof createProjectSchema>;

export interface ApiResponse<T> {
	data?: T;
	project?: Project;
	projects?: Project[];
	message?: string;
	error?: string;
	success?: boolean;
}
