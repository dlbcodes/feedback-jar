<script setup lang="ts">
import type { Feedback } from "~/types/feedback";

const route = useRoute();
const projectId = computed(() => route.params.id as string);
const feedbackStore = useFeedbackStore();

const showIssueModal = ref(false);
const selectedFeedback = ref<Feedback | null>(null);
const selectedRange = ref("30d");

const dateRangeOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "7D", value: "7d" },
    { label: "30D", value: "30d" },
    { label: "3M", value: "3m" },
    { label: "6M", value: "6m" },
    { label: "12M", value: "12m" },
];

const getFeedback = async () => {
    await feedbackStore.fetchFeedback(projectId.value);
};

const goToPage = async (page: number) => {
    await feedbackStore.fetchFeedback(projectId.value, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
};

const nextPage = () => {
    if (feedbackStore.hasNextPage) {
        goToPage(feedbackStore.currentPage + 1);
    }
};

const prevPage = () => {
    if (feedbackStore.hasPrevPage) {
        goToPage(feedbackStore.currentPage - 1);
    }
};

const openIssueModal = (feedback: Feedback) => {
    selectedFeedback.value = feedback;
    showIssueModal.value = true;
};

const closeIssueModal = () => {
    showIssueModal.value = false;
    selectedFeedback.value = null;
};

onMounted(() => {
    if (projectId.value) {
        getFeedback();
    }
});
</script>

<template>
    <div class="relative">
        <div class="flex flex-col gap-y-4">
            <AdminHeader
                title="Issues"
                :loading="feedbackStore.isLoading"
                @refresh="getFeedback"
            />
            <DateRange :options="dateRangeOptions" v-model="selectedRange" />
        </div>

        <div
            v-if="
                feedbackStore.isLoading && feedbackStore.feedbacks.length === 0
            "
        >
            Loading feedback...
        </div>
        <div v-else-if="feedbackStore.error" style="color: red">
            {{ feedbackStore.error }}
        </div>
        <div v-else>
            <Table>
                <TableHeader class="sticky top-0 z-40">
                    <TableRow>
                        <TableHead>Preview</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Page</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Browser</TableHead>
                        <TableHead>Operating system</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow
                        v-for="item in feedbackStore.feedbacks"
                        :key="item.id"
                        class="cursor-pointer hover:bg-stone-50 transition-colors"
                    >
                        <div @click="openIssueModal(item)">
                            <TableCell>
                                <div
                                    class="w-20 aspect-video bg-stone-200 rounded-xl border border-stone-100 overflow-hidden"
                                >
                                    <img
                                        v-if="item.screenshotUrl"
                                        :src="item.screenshotUrl"
                                        :alt="`Screenshot for ${item.message}`"
                                        class="w-full h-full object-cover"
                                    />
                                </div>
                            </TableCell>
                            <TableCell>{{ item.type.label }}</TableCell>
                            <TableCell>
                                <span class="line-clamp-2">{{
                                    item.message
                                }}</span>
                            </TableCell>
                            <TableCell>{{
                                useTimeAgo(item.createdAt)
                            }}</TableCell>
                            <TableCell>
                                <span class="max-w-xs truncate block">
                                    {{ item.pageUrl }}
                                </span>
                            </TableCell>
                            <TableCell>{{
                                item.metadata?.country || "N/A"
                            }}</TableCell>
                            <TableCell>{{ item.browser }}</TableCell>
                            <TableCell>{{ item.os }}</TableCell>
                            <TableCell>
                                <span
                                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                                    :class="{
                                        'bg-green-100 text-green-800':
                                            item.status === 'resolved',
                                        'bg-yellow-100 text-yellow-800':
                                            item.status === 'in_progress',
                                        'bg-blue-100 text-blue-800':
                                            item.status === 'new',
                                        'bg-gray-100 text-gray-800':
                                            item.status === 'closed',
                                    }"
                                >
                                    {{ item.status }}
                                </span>
                            </TableCell>
                        </div>
                    </TableRow>
                </TableBody>
            </Table>

            <div
                v-if="
                    !feedbackStore.isLoading &&
                    feedbackStore.feedbacks.length > 0
                "
                class="mt-6"
            >
                <Pagination
                    :current-page="feedbackStore.currentPage"
                    :total-pages="feedbackStore.totalPages"
                    :total="feedbackStore.totalCount"
                    :limit="20"
                    :has-more="feedbackStore.hasNextPage"
                    :has-prev="feedbackStore.hasPrevPage"
                    :loading="feedbackStore.isLoading"
                    item-name="feedback items"
                    @update:page="goToPage"
                    @next="nextPage"
                    @prev="prevPage"
                />
            </div>

            <div
                v-if="
                    !feedbackStore.isLoading &&
                    feedbackStore.feedbacks.length === 0
                "
                class="text-center py-12 text-stone-500"
            >
                No feedback items found
            </div>
        </div>
    </div>

    <IssueModal
        v-if="selectedFeedback"
        v-model="showIssueModal"
        :item="selectedFeedback"
        @close="closeIssueModal"
    />
</template>
