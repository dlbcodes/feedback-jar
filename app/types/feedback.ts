export interface Feedback {
	id: string;
	projectId: string;
	message: string;
	email: string;
	typeId: string;
	type: FeedbackType;
	status: 'new' | 'in_progress' | 'resolved' | 'closed';
	assignedToId?: string;
	assignedTo?: {
		id: string;
		name: string;
		email: string;
	};
	screenshotUrl?: string;
	pageUrl: string;
	browser?: string;
	browserVersion?: string;
	os?: string;
	deviceType?: string;
	viewportWidth?: number;
	viewportHeight?: number;
	devicePixelRatio?: number;
	userAgent?: string;
	sessionId?: string;
	userId?: string;
	metadata?: Record<string, any>;
	customFields?: Record<string, any>;
	comments?: FeedbackComment[];
	createdAt: string;
	updatedAt: string;
	_count?: {
		comments: number;
	};
}

export interface FeedbackType {
	id: string;
	name: string;
	label: string;
	emoji?: string;
	isDefault: boolean;
	projectId: string;
	createdAt: string;
}

export interface FeedbackComment {
	id: string;
	feedbackId: string;
	authorId: string;
	author: {
		id: string;
		name: string;
		avatar: string;
	};
	content: string;
	isInternal: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface FeedbackFilters {
	page?: number;
	limit?: number;
	status?: string;
	typeId?: string;
	assignedToId?: string;
	search?: string;
}

export interface UpdateFeedbackDto {
	status?: string;
	assignedToId?: string;
}

export interface CreateCommentDto {
	content: string;
	isInternal?: boolean;
}

export interface CreateFeedbackTypeDto {
	name: string;
	label: string;
	emoji?: string;
}

export interface PaginatedResponse<T> {
	feedbacks: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}