export interface Analytics {
	id: string;
	projectId: string;
	timestamp: string;
	createdAt?: string;
	[key: string]: any; // For additional analytics fields
}

export interface AnalyticsQueryParams {
	projectId: string;
	limit?: number;
	offset?: number;
}

export interface ApiResponse<T> {
	data?: T;
	analytics?: Analytics[];
	message?: string;
	error?: string;
	success?: boolean;
}