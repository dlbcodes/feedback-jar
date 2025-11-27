<script setup lang="ts">
interface EventBreakdown {
    event: string;
    count: number;
    uniqueUsers: number;
}

interface Props {
    events: EventBreakdown[];
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
});

// Format numbers with commas
const formatNumber = (num: number) => num.toLocaleString();

// Calculate percentage of total
const totalEvents = computed(() =>
    props.events.reduce((sum, item) => sum + item.count, 0)
);

const getPercentage = (count: number) => {
    if (totalEvents.value === 0) return "0";
    return ((count / totalEvents.value) * 100).toFixed(1);
};
</script>

<template>
    <Panel class="p-6">
        <div class="mb-4">
            <h3 class="text-lg font-semibold text-stone-950">
                Events Breakdown
            </h3>
            <p class="text-sm text-stone-600 mt-1">
                Event types and their occurrence
            </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-3">
            <div
                v-for="i in 5"
                :key="i"
                class="flex items-center justify-between py-3 border-b border-stone-200 last:border-0"
            >
                <div class="flex-1 space-y-2">
                    <div
                        class="h-4 bg-stone-200 rounded w-32 animate-pulse"
                    ></div>
                    <div
                        class="h-3 bg-stone-100 rounded w-24 animate-pulse"
                    ></div>
                </div>
                <div class="flex gap-8">
                    <div
                        class="h-4 bg-stone-200 rounded w-16 animate-pulse"
                    ></div>
                    <div
                        class="h-4 bg-stone-200 rounded w-16 animate-pulse"
                    ></div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div
            v-else-if="events.length === 0"
            class="text-center py-12 text-stone-500"
        >
            No events recorded yet
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-stone-200">
                        <th
                            class="text-left py-3 px-2 text-sm font-semibold text-stone-700"
                        >
                            Event
                        </th>
                        <th
                            class="text-right py-3 px-2 text-sm font-semibold text-stone-700"
                        >
                            Count
                        </th>
                        <th
                            class="text-right py-3 px-2 text-sm font-semibold text-stone-700"
                        >
                            Unique Users
                        </th>
                        <th
                            class="text-right py-3 px-2 text-sm font-semibold text-stone-700"
                        >
                            % of Total
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="event in events"
                        :key="event.event"
                        class="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                    >
                        <td class="py-3 px-2">
                            <div class="flex items-center gap-2">
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                                >
                                    {{ event.event }}
                                </span>
                            </div>
                        </td>
                        <td class="py-3 px-2 text-right font-mono text-sm">
                            {{ formatNumber(event.count) }}
                        </td>
                        <td class="py-3 px-2 text-right font-mono text-sm">
                            {{ formatNumber(event.uniqueUsers) }}
                        </td>
                        <td class="py-3 px-2 text-right text-sm text-stone-600">
                            {{ getPercentage(event.count) }}%
                        </td>
                    </tr>
                </tbody>
                <tfoot class="border-t-2 border-stone-200">
                    <tr class="font-semibold">
                        <td class="py-3 px-2 text-stone-900">Total</td>
                        <td
                            class="py-3 px-2 text-right font-mono text-stone-900"
                        >
                            {{ formatNumber(totalEvents) }}
                        </td>
                        <td class="py-3 px-2 text-right text-stone-600">—</td>
                        <td class="py-3 px-2 text-right text-stone-900">
                            100%
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </Panel>
</template>
