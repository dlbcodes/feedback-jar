import { defineStore } from 'pinia';
import { useToast } from '@/composables/useToast';
import {
	createFeedbackApiService,
	FeedbackApiError,
} from '@/services/FeedbackApiService';
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

export const useFeedbackStore = defineStore('feedback', () => {
	const { addToast } = useToast();

	// ========================================
	// STATE
	// ========================================
	const feedbacks = ref<Feedback[]>([]);
	const currentFeedback = ref<Feedback | null>(null);
	const types = ref<FeedbackType[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);
	const commentsByFeedbackId = ref<Record<string, FeedbackComment[]>>({});
	const commentsLoading = ref<Record<string, boolean>>({});


	// Pagination
	const currentPage = ref(1);
	const totalPages = ref(1);
	const totalCount = ref(0);
	const pageLimit = ref(20);

	// Filters
	const filters = ref<FeedbackFilters>({
		status: undefined,
		typeId: undefined,
		assignedToId: undefined,
		search: undefined,
	});

	// ========================================
	// GETTERS
	// ========================================
	const isLoading = computed(() => loading.value);
	const hasNextPage = computed(() => currentPage.value < totalPages.value);
	const hasPrevPage = computed(() => currentPage.value > 1);

	const feedbacksByStatus = computed(() => {
		return feedbacks.value.reduce((acc, feedback) => {
			if (!acc[feedback.status]) acc[feedback.status] = [];
			acc[feedback.status].push(feedback);
			return acc;
		}, {} as Record<string, Feedback[]>);
	});

	const unassignedCount = computed(() =>
		feedbacks.value.filter(f => !f.assignedToId).length
	);

	const newFeedbackCount = computed(() =>
		feedbacks.value.filter(f => f.status === 'new').length
	);

	// ========================================
	// ACTIONS
	// ========================================

	/**
	 * Fetch all feedback for a project
	 */
	async function fetchFeedback(projectId: string, page = 1): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			const service = createFeedbackApiService(projectId);
			const response = await service.getAll({
				page,
				limit: pageLimit.value,
				...filters.value,
			});

			feedbacks.value = response.feedbacks;
			currentPage.value = response.pagination.page;
			totalPages.value = response.pagination.totalPages;
			totalCount.value = response.pagination.total;

			return true;
		} catch (err) {
			const errorMessage = err instanceof FeedbackApiError
				? err.message
				: 'Failed to fetch feedback';

			error.value = errorMessage;
			addToast(errorMessage, { type: 'error' });

			return false;
		} finally {
			loading.value = false;
		}
	}

	/**
	 * Fetch single feedback by ID
	 */
	async function fetchFeedbackById(projectId: string, feedbackId: string): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			const service = createFeedbackApiService(projectId);
			currentFeedback.value = await service.getById(feedbackId);

			return true;
		} catch (err) {
			const errorMessage = err instanceof FeedbackApiError
				? err.message
				: 'Failed to fetch feedback';

			error.value = errorMessage;
			addToast(errorMessage, { type: 'error' });

			return false;
		} finally {
			loading.value = false;
		}
	}

	/**
	 * Update feedback
	 */
	async function updateFeedback(
		projectId: string,
		feedbackId: string,
		updates: UpdateFeedbackDto
	): Promise<boolean> {
		loading.value = true;
		error.value = null;

		// Optimistic update
		const originalFeedback = currentFeedback.value;
		const originalInList = feedbacks.value.find(f => f.id === feedbackId);

		if (currentFeedback.value?.id === feedbackId) {
			currentFeedback.value = { ...currentFeedback.value, ...updates };
		}

		const index = feedbacks.value.findIndex(f => f.id === feedbackId);
		if (index !== -1) {
			feedbacks.value[index] = { ...feedbacks.value[index], ...updates };
		}

		try {
			const service = createFeedbackApiService(projectId);
			const updated = await service.update(feedbackId, updates);

			if (currentFeedback.value?.id === feedbackId) {
				currentFeedback.value = updated;
			}

			if (index !== -1) {
				feedbacks.value[index] = updated;
			}

			addToast('Feedback updated successfully', { type: 'success' });

			return true;
		} catch (err) {
			// Rollback
			if (originalFeedback && currentFeedback.value?.id === feedbackId) {
				currentFeedback.value = originalFeedback;
			}
			if (originalInList && index !== -1) {
				feedbacks.value[index] = originalInList;
			}

			const errorMessage = err instanceof FeedbackApiError
				? err.message
				: 'Failed to update feedback';

			error.value = errorMessage;
			addToast(errorMessage, { type: 'error' });

			return false;
		} finally {
			loading.value = false;
		}
	}

	/**
 * Fetch comments for a specific feedback
 */
	async function fetchComments(
		projectId: string,
		feedbackId: string
	): Promise<boolean> {
		commentsLoading.value[feedbackId] = true;

		try {
			const service = createFeedbackApiService(projectId);
			const comments = await service.getComments(feedbackId);

			// Store comments by feedbackId
			commentsByFeedbackId.value[feedbackId] = comments;

			return true;
		} catch (err) {
			const errorMessage = err instanceof FeedbackApiError
				? err.message
				: 'Failed to fetch comments';

			addToast(errorMessage, { type: 'error' });
			return false;
		} finally {
			commentsLoading.value[feedbackId] = false;
		}
	}

	/**
	 * Get comments for a specific feedback from cache
	 */
	function getComments(feedbackId: string): FeedbackComment[] {
		return commentsByFeedbackId.value[feedbackId] || [];
	}

	/**
	 * Check if comments are loading for a specific feedback
	 */
	function isLoadingComments(feedbackId: string): boolean {
		return commentsLoading.value[feedbackId] || false;
	}

	/**
	 * Add comment to feedback
	 */
	async function addComment(
		projectId: string,
		feedbackId: string,
		comment: CreateCommentDto
	): Promise<boolean> {
		const wasLoading = loading.value;
		loading.value = true;
		error.value = null;

		try {
			const service = createFeedbackApiService(projectId);
			const newComment = await service.addComment(feedbackId, comment);

			// Optimistically add to cache
			if (commentsByFeedbackId.value[feedbackId]) {
				commentsByFeedbackId.value[feedbackId] = [
					...commentsByFeedbackId.value[feedbackId],
					newComment,
				];
			} else {
				commentsByFeedbackId.value[feedbackId] = [newComment];
			}

			addToast('Comment added successfully', { type: 'success' });
			return true;
		} catch (err) {
			const errorMessage = err instanceof FeedbackApiError
				? err.message
				: 'Failed to add comment';

			error.value = errorMessage;
			addToast(errorMessage, { type: 'error' });
			return false;
		} finally {
			loading.value = wasLoading;
		}
	}

	/**
	 * Clear comments cache for a specific feedback
	 */
	function clearComments(feedbackId: string): void {
		delete commentsByFeedbackId.value[feedbackId];
		delete commentsLoading.value[feedbackId];
	}

	/**
	 * Clear all comments cache
	 */
	function clearAllComments(): void {
		commentsByFeedbackId.value = {};
		commentsLoading.value = {};
	}

	/**
	 * Fetch feedback types
	 */
	async function fetchTypes(projectId: string): Promise<boolean> {
		try {
			const service = createFeedbackApiService(projectId);
			types.value = await service.getTypes();

			return true;
		} catch (err) {
			const errorMessage = err instanceof FeedbackApiError
				? err.message
				: 'Failed to fetch feedback types';

			error.value = errorMessage;
			addToast(errorMessage, { type: 'error' });

			return false;
		}
	}

	/**
	 * Create custom feedback type
	 */
	async function createType(projectId: string, data: CreateFeedbackTypeDto): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			const service = createFeedbackApiService(projectId);
			const newType = await service.createType(data);

			types.value.push(newType);

			addToast('Feedback type created successfully', { type: 'success' });

			return true;
		} catch (err) {
			const errorMessage = err instanceof FeedbackApiError
				? err.message
				: 'Failed to create feedback type';

			error.value = errorMessage;
			addToast(errorMessage, { type: 'error' });

			return false;
		} finally {
			loading.value = false;
		}
	}

	/**
	 * Update filters
	 */
	function setFilters(newFilters: Partial<FeedbackFilters>): void {
		filters.value = { ...filters.value, ...newFilters };
	}

	/**
	 * Clear all data
	 */
	function clearAll(): void {
		feedbacks.value = [];
		currentFeedback.value = null;
		types.value = [];
		error.value = null;
		currentPage.value = 1;
		totalPages.value = 1;
		totalCount.value = 0;
		filters.value = {
			status: undefined,
			typeId: undefined,
			assignedToId: undefined,
			search: undefined,
		};
		clearAllComments();
	}

	// ========================================
	// PUBLIC API
	// ========================================
	return {
		// State
		feedbacks: readonly(feedbacks),
		currentFeedback: readonly(currentFeedback),
		types: readonly(types),
		loading: readonly(loading),
		error: readonly(error),
		currentPage: readonly(currentPage),
		totalPages: readonly(totalPages),
		totalCount: readonly(totalCount),
		filters: readonly(filters),

		// Getters
		isLoading,
		hasNextPage,
		hasPrevPage,
		feedbacksByStatus,
		unassignedCount,
		newFeedbackCount,

		// Actions
		fetchFeedback,
		fetchFeedbackById,
		updateFeedback,
		addComment,
		fetchComments,
		getComments,
		isLoadingComments,
		clearComments,
		clearAllComments,
		fetchTypes,
		createType,
		setFilters,
		clearAll,
	};
});