<script setup lang="ts">
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/vue";
import { Float } from "@headlessui-float/vue";
import {
    ChevronUpDownIcon,
    CheckIcon,
    PlusIcon,
} from "@heroicons/vue/20/solid";
import { popoverVariants, type PopoverProps } from "~/variants/PopoverVariants";
import { navigationVariants } from "~/variants/NavigationVariants";

const projectsStore = useProjectsStore();
const route = useRoute();
const router = useRouter();

// Get project ID from route
const routeProjectId = computed(() => route.params.id as string | undefined);

// Local reactive reference for the selected project
const selectedProject = computed({
    get: () => projectsStore.currentProject,
    set: async (value) => {
        if (value) {
            projectsStore.setCurrentProject(value);
            // Navigate to the selected project
            await router.push(`/admin/${value.id}`);
        }
    },
});

const handleCreateProject = async () => {
    console.log("project");
    await router.push("/admin/new");
};

// Sync currentProject with route on mount and route changes
watch(
    routeProjectId,
    async (projectId) => {
        if (projectId) {
            // If projects not loaded yet, fetch them
            if (!projectsStore.hasProjects) {
                await projectsStore.fetchProjects();
            }

            // Find and set the project from route
            const project = projectsStore.getProjectById(projectId);

            if (project && project.id !== projectsStore.currentProject?.id) {
                projectsStore.setCurrentProject(project);
            } else if (!project) {
                // Project not in cache, fetch it
                await projectsStore.fetchProjectById(projectId);
            }
        }
    },
    { immediate: true }
);

// Fetch projects on mount if not already loaded
onMounted(async () => {
    if (!projectsStore.hasProjects) {
        await projectsStore.fetchProjects();
    }
});
</script>

<template>
    <Listbox v-model="selectedProject">
        <div class="relative">
            <Float
                placement="bottom-end"
                :offset="2"
                flip
                shift
                :z-index="99999"
                portal
            >
                <ListboxButton
                    class="relative w-full cursor-pointer rounded-lg bg-white dark:bg-dark-800 py-2 pl-3 pr-10 text-left ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <div v-if="selectedProject" class="flex flex-col gap-x-1">
                        <div class="flex items-center gap-x-2">
                            <img
                                :src="getFaviconUrl(selectedProject.domain)"
                                alt="Domain favicon"
                                class="size-5 shrink-0"
                            />
                            <span class="block truncate">
                                {{ selectedProject.name }}
                            </span>
                        </div>
                    </div>
                    <span
                        v-else
                        class="block truncate text-stone-400 dark:text-dark-500"
                    >
                        Select a project...
                    </span>
                    <span
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                        <ChevronUpDownIcon
                            class="h-5 w-5 text-stone-400"
                            aria-hidden="true"
                        />
                    </span>
                </ListboxButton>

                <Transition
                    enter="transition ease-out duration-100"
                    enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95"
                >
                    <ListboxOptions
                        :class="
                            cn(
                                popoverVariants({
                                    variant: 'primary',
                                    size: 'fit',
                                }),
                                'max-w-2xs'
                            )
                        "
                    >
                        <ListboxOption
                            v-for="project in projectsStore.sortedProjects"
                            :key="project.id"
                            :value="project"
                            v-slot="{ active, selected }"
                            as="template"
                        >
                            <li
                                :class="
                                    cn(
                                        navigationVariants({
                                            variant: 'primary',
                                        }),
                                        'relative'
                                    )
                                "
                            >
                                <div class="flex items-center gap-x-2">
                                    <img
                                        :src="getFaviconUrl(project.domain)"
                                        alt="Domain favicon"
                                        class="size-5 shrink-0"
                                    />
                                    {{ project.name }}
                                </div>

                                <span
                                    v-if="selected"
                                    class="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    <CheckIcon
                                        class="h-4 w-4 text-stone-600 dark:text-dark-300"
                                        aria-hidden="true"
                                    />
                                </span>
                            </li>
                        </ListboxOption>

                        <!-- Create new project option -->
                        <ListboxOption as="div" class="py-2" :value="null">
                            <Button @click="handleCreateProject">
                                <div class="flex items-center gap-x-2">
                                    <PlusIcon class="size-5 shrink-0" />
                                    <span class="text-sm font-medium">
                                        Create new project
                                    </span>
                                </div>
                            </Button>
                        </ListboxOption>
                    </ListboxOptions>
                </Transition>
            </Float>
        </div>
    </Listbox>
</template>
