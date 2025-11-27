<script setup lang="ts">
import { navigationVariants } from "~/variants/NavigationVariants";
import { PlusIcon, EllipsisVerticalIcon } from "@heroicons/vue/24/outline";
import { buttonVariants } from "~/variants/ButtonVariants";

const props = defineProps<{
    sortedCharts: any[];
    projectId: string;
    isLoading: boolean;
    hasCharts: boolean;
}>();

// Store
const chartsStore = useChartsStore();

// Local state
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const chartToDelete = ref<any>(null);

const handleDeleteClick = (chart: any) => {
    chartToDelete.value = chart;
    showDeleteModal.value = true;
};

const handleConfirmDelete = async () => {
    console.log(chartToDelete.value);
    if (!chartToDelete.value) return;

    try {
        await chartsStore.deleteChart(props.projectId, chartToDelete.value.id);
        showDeleteModal.value = false;
        chartToDelete.value = null;
    } catch (error) {
        console.error("Failed to delete chart:", error);
        // Error is already set in the store
    }
};

const handleDuplicate = async (chartId: string) => {
    if (!chartId) return;

    try {
        await chartsStore.duplicateChart(props.projectId, chartId);
    } catch (error) {
        console.error("Failed to duplicate chart:", error);
    }
};

const handleCancelDelete = () => {
    showDeleteModal.value = false;
    chartToDelete.value = null;
};

const dropdownOptions = (chart: any) => [
    {
        label: "Edit chart",
        action: () => (showEditModal.value = true),
    },
    {
        label: "Duplicate chart",
        action: () => handleDuplicate(chart.id),
    },
    {
        label: "Delete chart",
        action: () => handleDeleteClick(chart),
    },
];
</script>

<template>
    <div class="flex flex-col gap-y-1 min-h-0 flex-1">
        <div class="flex items-center justify-between px-1">
            <span class="text-xs font-medium text-stone-500 whitespace-nowrap">
                Charts
            </span>

            <NuxtLink :to="`/admin/${projectId}/charts`">
                <PlusIcon class="size-4" />
            </NuxtLink>
        </div>

        <!-- Loading -->
        <div v-if="isLoading && !hasCharts" class="px-1 py-2">
            <div class="animate-pulse space-y-2">
                <div class="h-6 bg-stone-100 rounded-lg"></div>
                <div class="h-6 bg-stone-100 rounded-lg"></div>
                <div class="h-6 bg-stone-100 rounded-lg"></div>
            </div>
        </div>

        <!-- Empty -->
        <div
            v-else-if="!hasCharts && !isLoading"
            class="flex flex-col items-center justify-center py-6 px-4 text-center"
        >
            <svg
                class="w-8 h-8 text-stone-300 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
            </svg>
            <p class="text-xs text-stone-500 mb-2">No charts yet</p>
            <NuxtLink
                :to="`/admin/${projectId}/charts/new`"
                class="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
                Create your first chart
            </NuxtLink>
        </div>

        <!-- List -->
        <div
            v-else
            class="flex flex-col gap-y-1 overflow-y-auto min-h-0 flex-1"
        >
            <NuxtLink
                v-for="chart in sortedCharts"
                :key="chart.id"
                :to="`/admin/${projectId}/charts/${chart.id}`"
                :class="cn(navigationVariants({ variant: 'primary' }))"
                :title="chart.description || chart.name"
            >
                <span class="truncate">{{ chart.name }}</span>

                <Dropdown
                    :options="dropdownOptions(chart)"
                    variant="contrast"
                    size="sm"
                    @click.stop
                >
                    <span
                        :class="
                            buttonVariants({ variant: 'icon', size: 'icon-sm' })
                        "
                    >
                        <EllipsisVerticalIcon class="size-4 shrink-0 block" />
                    </span>
                </Dropdown>
            </NuxtLink>
        </div>

        <EditChartModal v-model="showEditModal" />

        <!-- Delete Modal -->
        <DeleteModal
            v-model="showDeleteModal"
            title="Delete Chart"
            :description="`Are you sure you want to delete '${chartToDelete?.name}'? This action cannot be undone.`"
            confirmText="Delete"
            :isLoading="chartsStore.isSaving"
            @confirm="handleConfirmDelete"
            @cancel="handleCancelDelete"
        />
    </div>
</template>
