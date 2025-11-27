<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

interface Props {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    hasMore: boolean;
    hasPrev: boolean;
    loading?: boolean;
    showInfo?: boolean; // Option to hide/show the info text
    itemName?: string; // Generic name for items (e.g., "events", "users", "products")
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    showInfo: true,
    itemName: "results",
});

const emit = defineEmits<{
    "update:page": [page: number];
    next: [];
    prev: [];
}>();

// Generate smart page numbers
const pageNumbers = computed(() => {
    const pages: (number | string)[] = [];
    const total = props.totalPages;
    const current = props.currentPage;

    if (total === 0) return [];

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);

        if (current > 3) {
            pages.push("...");
        }

        for (
            let i = Math.max(2, current - 1);
            i <= Math.min(total - 1, current + 1);
            i++
        ) {
            pages.push(i);
        }

        if (current < total - 2) {
            pages.push("...");
        }

        pages.push(total);
    }

    return pages;
});

const startItem = computed(() => {
    if (props.total === 0) return 0;
    return (props.currentPage - 1) * props.limit + 1;
});

const endItem = computed(() =>
    Math.min(props.currentPage * props.limit, props.total)
);
</script>

<template>
    <div class="flex items-center justify-between">
        <div v-if="showInfo" class="text-sm text-stone-600">
            <template v-if="total > 0">
                Showing {{ startItem }} to {{ endItem }} of
                {{ total.toLocaleString() }} {{ itemName }}
            </template>
            <template v-else> No {{ itemName }} found </template>
        </div>
        <div v-else></div>

        <div v-if="totalPages > 1" class="flex items-center gap-x-2">
            <Button
                variant="outline"
                size="sm"
                @click="emit('prev')"
                :disabled="!hasPrev || loading"
            >
                <ChevronLeftIcon class="size-4 mr-1" />
                Previous
            </Button>

            <div class="flex items-center gap-x-1">
                <template v-for="page in pageNumbers" :key="page">
                    <span
                        v-if="page === '...'"
                        class="px-3 py-1 text-stone-500"
                    >
                        ...
                    </span>
                    <Button
                        v-else
                        :variant="currentPage === page ? 'primary' : 'ghost'"
                        size="sm"
                        @click="emit('update:page', page as number)"
                        :disabled="loading"
                        class="min-w-[40px]"
                    >
                        {{ page }}
                    </Button>
                </template>
            </div>

            <Button
                variant="outline"
                size="sm"
                @click="emit('next')"
                :disabled="!hasMore || loading"
            >
                Next
                <ChevronRightIcon class="size-4 ml-1" />
            </Button>
        </div>
    </div>
</template>
