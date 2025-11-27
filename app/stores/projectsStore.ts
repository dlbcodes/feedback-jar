// stores/projectsStore.ts
import { defineStore } from 'pinia'
import { useToast } from '@/composables/useToast'
import {
	projectsApiService,
	ProjectsApiError
} from '@/services/ProjectsApiService'
import { type CreateProjectDto, type Project } from '~/types/project'

/**
 * Projects Store - handles project data and operations
 */
export const useProjectsStore = defineStore('projects', () => {
	const { addToast } = useToast()

	// ========================================
	// STATE
	// ========================================
	const projects = ref<Project[]>([])
	const currentProject = ref<Project | null>(null)
	const loading = ref(false)
	const error = ref<string | null>(null)

	// ========================================
	// GETTERS
	// ========================================
	const hasProjects = computed(() => projects.value.length > 0)
	const isLoading = computed(() => loading.value)
	const projectCount = computed(() => projects.value.length)

	/**
	 * Get project by ID from cache
	 */
	const getProjectById = computed(() => {
		return (projectId: string) => projects.value.find(p => p.id === projectId)
	})

	/**
	 * Get projects sorted by creation date (newest first)
	 */
	const sortedProjects = computed(() => {
		return [...projects.value].sort((a, b) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)
	})

	// ========================================
	// ACTIONS
	// ========================================

	/**
	 * Fetch all projects for the authenticated user
	 */
	async function fetchProjects(): Promise<boolean> {
		loading.value = true
		error.value = null

		try {
			const fetchedProjects = await projectsApiService.getAll()
			projects.value = fetchedProjects
			return true
		} catch (err) {
			const errorMessage = err instanceof ProjectsApiError
				? err.message
				: 'Failed to fetch projects'

			error.value = errorMessage
			addToast(errorMessage, { type: 'error' })
			return false
		} finally {
			loading.value = false
		}
	}

	/**
	 * Fetch a single project by ID
	 */
	async function fetchProjectById(projectId: string): Promise<boolean> {
		loading.value = true
		error.value = null

		try {
			const fetchedProject = await projectsApiService.getById(projectId)
			currentProject.value = fetchedProject

			// Update in cache if exists
			const index = projects.value.findIndex(p => p.id === projectId)
			if (index !== -1) {
				projects.value[index] = fetchedProject
			} else {
				projects.value.push(fetchedProject)
			}

			return true
		} catch (err) {
			const errorMessage = err instanceof ProjectsApiError
				? err.message
				: 'Failed to fetch project'

			error.value = errorMessage
			addToast(errorMessage, { type: 'error' })
			return false
		} finally {
			loading.value = false
		}
	}

	/**
	 * Create a new project
	 */
	async function createProject(data: CreateProjectDto): Promise<Project | null> {
		loading.value = true
		error.value = null

		try {
			const newProject = await projectsApiService.create(data)

			// Add to local state
			projects.value.unshift(newProject)
			currentProject.value = newProject

			addToast('Project created successfully', { type: 'success' })
			return newProject
		} catch (err) {
			const errorMessage = err instanceof ProjectsApiError
				? err.message
				: 'Failed to create project'

			error.value = errorMessage
			addToast(errorMessage, { type: 'error' })
			return null
		} finally {
			loading.value = false
		}
	}

	/**
	 * Delete a project
	 */
	async function deleteProject(projectId: string): Promise<boolean> {
		loading.value = true
		error.value = null

		// Store original for rollback
		const originalProjects = [...projects.value]
		const originalCurrent = currentProject.value

		// Optimistic delete
		projects.value = projects.value.filter(p => p.id !== projectId)
		if (currentProject.value?.id === projectId) {
			currentProject.value = null
		}

		try {
			await projectsApiService.delete(projectId)
			addToast('Project deleted successfully', { type: 'success' })
			return true
		} catch (err) {
			// Rollback on error
			projects.value = originalProjects
			currentProject.value = originalCurrent

			const errorMessage = err instanceof ProjectsApiError
				? err.message
				: 'Failed to delete project'

			error.value = errorMessage
			addToast(errorMessage, { type: 'error' })
			return false
		} finally {
			loading.value = false
		}
	}

	/**
	 * Set current project
	 */
	function setCurrentProject(project: Project | null): void {
		currentProject.value = project
	}

	/**
	 * Clear current project
	 */
	function clearCurrentProject(): void {
		currentProject.value = null
	}

	/**
	 * Clear all projects data
	 */
	function clearAll(): void {
		projects.value = []
		currentProject.value = null
		error.value = null
	}

	/**
	 * Set projects directly (for SSR or initial load)
	 */
	function setProjects(projectsData: Project[]): void {
		projects.value = projectsData
	}

	// ========================================
	// PUBLIC API
	// ========================================
	return {
		// State
		projects: readonly(projects),
		currentProject: readonly(currentProject),
		loading: readonly(loading),
		error: readonly(error),

		// Getters
		hasProjects,
		isLoading,
		projectCount,
		getProjectById,
		sortedProjects,

		// Actions
		fetchProjects,
		fetchProjectById,
		createProject,
		deleteProject,
		setCurrentProject,
		clearCurrentProject,
		clearAll,
		setProjects
	}
})