import { useProjectsStore } from '~/stores/projectsStore'

export default defineNuxtRouteMiddleware(async (to, from) => {
	if (import.meta.server) {
		return
	}
	// Only run on /admin (not /admin/something)
	if (to.path !== '/admin') {
		return
	}

	console.log('admin middleware')

	// Wait for auth to be ready (assuming you're using Supabase or similar)
	const user = useSupabaseUser()

	// If no user, let auth middleware handle it
	if (!user.value) {
		return
	}

	const projectsStore = useProjectsStore()

	try {
		// Fetch projects if not already loaded
		if (!projectsStore.hasProjects && !projectsStore.isLoading) {
			await projectsStore.fetchProjects()
		}

		// Redirect to first project or create page
		if (projectsStore.hasProjects) {
			const firstProject = projectsStore.sortedProjects[0]

			return navigateTo(`/admin/${firstProject?.id}`, { replace: true })
		} else {
			return navigateTo('/admin/new', { replace: true })
		}
	} catch (error) {
		console.error('Error in admin-redirect middleware:', error)
		// If there's an auth error, redirect to login
		return navigateTo('/login', { replace: true })
	}
})