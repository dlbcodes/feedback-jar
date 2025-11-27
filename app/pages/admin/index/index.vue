<script setup lang="ts">
definePageMeta({
    middleware: "admin-redirect",
});

const projectsStore = useProjectsStore();
const loading = ref(true);

onMounted(async () => {
    // This page should redirect via middleware, but just in case:
    if (!projectsStore.hasProjects) {
        await projectsStore.fetchProjects();
    }

    if (projectsStore.hasProjects) {
        const firstProject = projectsStore.sortedProjects[0];
        await navigateTo(`/admin/${firstProject?.id}`);
    } else {
        // Redirect to create project or onboarding page
        await navigateTo("/admin/new");
    }

    loading.value = false;
});
</script>

<template>
    <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
            <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"
            ></div>
            <p class="mt-4 text-gray-600">Loading your projects...</p>
        </div>
    </div>
</template>
