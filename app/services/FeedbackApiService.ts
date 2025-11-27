import type {
	Feedback,
	FeedbackType,
	FeedbackComment,
	CreateFeedbackTypeDto,
	UpdateFeedbackDto,
	CreateCommentDto,
	FeedbackFilters,
	PaginatedResponse
} from "~/types/feedback";

export class FeedbackApiError extends Error {
	public readonly statusCode?: number;
	public readonly originalError?: any;

	constructor(message: string, statusCode?: number, originalError?: any) {
		super(message);
		this.name = "FeedbackApiError";
		this.statusCode = statusCode;
		this.originalError = originalError;
	}
}

export class FeedbackApiService {
	private readonly baseUrl: string;

	constructor(projectId: string) {
		this.baseUrl = `/api/v1/projects/${projectId}/feedback`;
	}

	/**
	 * Get all feedback for a project (paginated)
	 */
	async getAll(filters?: FeedbackFilters): Promise<PaginatedResponse<Feedback>> {
		try {
			const params = new URLSearchParams();

			if (filters?.page) params.append('page', filters.page.toString());
			if (filters?.limit) params.append('limit', filters.limit.toString());
			if (filters?.status) params.append('status', filters.status);
			if (filters?.typeId) params.append('typeId', filters.typeId);
			if (filters?.assignedToId) params.append('assignedToId', filters.assignedToId);
			if (filters?.search) params.append('search', filters.search);

			const url = params.toString() ? `${this.baseUrl}?${params}` : this.baseUrl;

			return await $fetch<PaginatedResponse<Feedback>>(url);
		} catch (error) {
			throw this._handleError(error, "Failed to fetch feedback");
		}
	}

	/**
	 * Get single feedback by ID
	 */
	async getById(feedbackId: string): Promise<Feedback> {
		if (!feedbackId) {
			throw new FeedbackApiError("Feedback ID is required");
		}

		try {
			return await $fetch<Feedback>(`${this.baseUrl}/${feedbackId}`);
		} catch (error) {
			throw this._handleError(error, "Failed to fetch feedback");
		}
	}

	/**
	 * Update feedback (status, assignment)
	 */
	async update(feedbackId: string, data: UpdateFeedbackDto): Promise<Feedback> {
		if (!feedbackId) {
			throw new FeedbackApiError("Feedback ID is required");
		}

		try {
			return await $fetch<Feedback>(`${this.baseUrl}/${feedbackId}`, {
				method: "PATCH",
				body: data,
			});
		} catch (error) {
			throw this._handleError(error, "Failed to update feedback");
		}
	}

	/**
	 * Add comment to feedback
	 */
	async addComment(feedbackId: string, data: CreateCommentDto): Promise<FeedbackComment> {
		if (!feedbackId) {
			throw new FeedbackApiError("Feedback ID is required");
		}

		if (!data.content?.trim()) {
			throw new FeedbackApiError("Comment content is required");
		}

		try {
			return await $fetch<FeedbackComment>(`${this.baseUrl}/${feedbackId}/comments`, {
				method: "POST",
				body: data,
			});
		} catch (error) {
			throw this._handleError(error, "Failed to add comment");
		}
	}

	/**
	 * Get comments for a feedback item
	 */
	async getComments(feedbackId: string): Promise<FeedbackComment[]> {
		if (!feedbackId) {
			throw new FeedbackApiError("Feedback ID is required");
		}

		try {
			const response = await $fetch<{ comments: FeedbackComment[] }>(
				`${this.baseUrl}/${feedbackId}/comments`
			);
			return response.comments;
		} catch (error) {
			throw this._handleError(error, "Failed to fetch comments");
		}
	}

	/**
	 * Get all feedback types for project
	 */
	async getTypes(): Promise<FeedbackType[]> {
		try {
			const projectId = this.baseUrl.split('/')[4]; // Extract from URL
			return await $fetch<FeedbackType[]>(`/api/v1/projects/${projectId}/feedback-types`);
		} catch (error) {
			throw this._handleError(error, "Failed to fetch feedback types");
		}
	}

	/**
	 * Create custom feedback type
	 */
	async createType(data: CreateFeedbackTypeDto): Promise<FeedbackType> {
		if (!data.name?.trim() || !data.label?.trim()) {
			throw new FeedbackApiError("Name and label are required");
		}


		try {
			const projectId = this.baseUrl.split('/')[4];
			return await $fetch<FeedbackType>(`/api/v1/projects/${projectId}/feedback-types`, {
				method: "POST",
				body: data,
			});
		} catch (error) {
			throw this._handleError(error, "Failed to create feedback type");
		}
	}

	private _handleError(error: any, fallbackMessage: string): FeedbackApiError {
		const message = error?.data?.message || error?.message || fallbackMessage;
		const statusCode = error?.status || error?.statusCode;

		console.error("FeedbackApiService Error:", {
			message,
			statusCode,
			originalError: error,
		});

		return new FeedbackApiError(message, statusCode, error);
	}
}

export function createFeedbackApiService(projectId: string): FeedbackApiService {
	return new FeedbackApiService(projectId);
}