export default defineNuxtRouteMiddleware((to, from) => {
	const user = useSupabaseUser();
	// If the user is authenticated, redirect them to the home
	if (user.value) {
		return navigateTo("/admin");
	}
});