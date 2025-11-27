import type { Project, CreateProjectDto, ApiResponse } from "~/types/project";

/**
 * Custom error class for Projects API errors
 */
export class ProjectsApiError extends Error {
	public readonly statusCode?: number;
	public readonly originalError?: any;

	constructor(message: string, statusCode?: number, originalError?: any) {
		super(message);
		this.name = "ProjectsApiError";
		this.statusCode = statusCode;
		this.originalError = originalError;
	}
}

/**
 * Projects API service
 */
export class ProjectsApiService {
	private readonly baseUrl: string;

	constructor(baseUrl: string = "/api/v1/projects") {
		this.baseUrl = baseUrl;
	}

	/**
	 * Fetch all projects for the authenticated user
	 */
	async getAll(): Promise<Project[]> {
		try {
			const response = await $fetch<Project[] | ApiResponse<Project[]>>(this.baseUrl);

			// Handle different response formats
			const projects = Array.isArray(response) ? response : response.data || response.projects;

			if (!Array.isArray(projects)) {
				throw new ProjectsApiError("Invalid projects response");
			}

			return projects;
		} catch (error) {
			throw this._handleError(error, "Failed to fetch projects");
		}
	}

	/**
	 * Fetch a single project by ID
	 */
	async getById(projectId: string): Promise<Project> {
		if (!projectId || projectId.trim().length === 0) {
			throw new ProjectsApiError("Project ID is required");
		}

		try {
			const response = await $fetch<Project | ApiResponse<Project>>(`${this.baseUrl}/${projectId}`);

			const project = (response as ApiResponse<Project>).data || (response as ApiResponse<Project>).project || response;

			if (!project || typeof project !== "object") {
				throw new ProjectsApiError("Invalid project response");
			}

			return project as Project;
		} catch (error) {
			throw this._handleError(error, "Failed to fetch project");
		}
	}

	/**
	 * Create a new project
	 */
	async create(data: CreateProjectDto): Promise<Project> {
		this._validateCreateInput(data);

		try {
			const response = await $fetch<Project | ApiResponse<Project>>(this.baseUrl, {
				method: "POST",
				body: data,
			});

			const project = (response as ApiResponse<Project>).data || (response as ApiResponse<Project>).project || response;

			if (!project) {
				throw new ProjectsApiError("Failed to create project");
			}

			return project as Project;
		} catch (error) {
			throw this._handleError(error, "Failed to create project");
		}
	}

	/**
	 * Delete a project
	 */
	async delete(projectId: string): Promise<void> {
		if (!projectId || projectId.trim().length === 0) {
			throw new ProjectsApiError("Project ID is required");
		}

		try {
			await $fetch(`${this.baseUrl}/${projectId}`, {
				method: "DELETE",
			});
		} catch (error) {
			throw this._handleError(error, "Failed to delete project");
		}
	}

	/**
	 * Private error handler
	 */
	private _handleError(error: any, fallbackMessage: string): ProjectsApiError {
		const message = error?.data?.message || error?.message || fallbackMessage;
		const statusCode = error?.status || error?.statusCode;

		console.error("ProjectsApiService Error:", {
			message,
			statusCode,
			originalError: error,
		});

		return new ProjectsApiError(message, statusCode, error);
	}

	/**
	 * Validate create input
	 */
	private _validateCreateInput(data: CreateProjectDto): void {
		if (!data.name || data.name.trim().length === 0) {
			throw new ProjectsApiError("Project name is required");
		}

		if (data.name.length > 200) {
			throw new ProjectsApiError("Project name must be 200 characters or less");
		}
	}
}

/**
 * Singleton instance
 */
export const projectsApiService = new ProjectsApiService();

/**
 * Factory function for custom configurations
 */
export function createProjectsApiService(baseUrl?: string): ProjectsApiService {
	return new ProjectsApiService(baseUrl);
}