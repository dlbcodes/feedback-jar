<script setup lang="ts">
import type { Feedback } from "~/types/feedback";
import {
    LinkIcon,
    OledDisplayIcon,
    VintageComputerIcon,
    BrowserIcon,
    PixelDisplayIcon,
    BugIcon,
    PlagueMaskIcon,
} from "~/assets/images/icons";
import {
    selectorGroupVariants,
    selectorVariants,
} from "~/variants/ButtonGroupVariants";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";

interface Props {
    modelValue: boolean;
    item: Feedback;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    close: [];
}>();

const message = ref("");
const feedbackStore = useFeedbackStore();
const route = useRoute();

const projectId = computed(() => route.params.id as string);
const isSubmitting = ref(false);

// Get comments from store
const comments = computed(() => feedbackStore.getComments(props.item.id));
const isLoadingComments = computed(() =>
    feedbackStore.isLoadingComments(props.item.id)
);

// Fetch comments when modal opens
watch(
    () => props.modelValue,
    async (isOpen) => {
        if (isOpen && props.item?.id) {
            // Fetch comments in background while showing existing data
            await feedbackStore.fetchComments(projectId.value, props.item.id);
        }
    },
    { immediate: true }
);

const tabs = [
    { key: "Session", label: "Session", icon: LinkIcon },
    { key: "Custom", label: "Custom", icon: PixelDisplayIcon },
] as const;

const statusOptions = [
    { value: "new", label: "New", class: "bg-blue-100 text-blue-800" },
    {
        value: "in_progress",
        label: "In Progress",
        class: "bg-yellow-100 text-yellow-800",
    },
    {
        value: "resolved",
        label: "Resolved",
        class: "bg-green-100 text-green-800",
    },
    { value: "closed", label: "Closed", class: "bg-gray-100 text-gray-800" },
];

const currentStatus = computed(
    () =>
        statusOptions.find((s) => s.value === props.item.status) ||
        statusOptions[0]
);

const addComment = async () => {
    if (!message.value.trim()) return;

    isSubmitting.value = true;
    try {
        const success = await feedbackStore.addComment(
            projectId.value,
            props.item.id,
            {
                content: message.value,
                isInternal: true,
            }
        );

        if (success) {
            message.value = "";
        }
    } catch (error) {
        console.error("Failed to add comment:", error);
    } finally {
        isSubmitting.value = false;
    }
};

const updateStatus = async (newStatus: string) => {
    await feedbackStore.updateFeedback(projectId.value, props.item.id, {
        status: newStatus,
    });
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
};

const closeModal = () => {
    emit("update:modelValue", false);
    emit("close");
};
</script>

<template>
    <Modal :modelValue="modelValue" size="7xl" @update:modelValue="closeModal">
        <div class="flex gap-x-6 max-h-[85vh]">
            <!-- Left Panel -->
            <div
                class="w-3/4 flex flex-col shrink-0 overflow-y-auto gap-y-6 pr-4"
            >
                <!-- Status Badge -->
                <div class="flex items-center gap-x-2">
                    <span
                        class="text-sm px-3 py-1.5 rounded-lg font-medium"
                        :class="currentStatus.class"
                    >
                        {{ currentStatus.label }}
                    </span>
                </div>

                <!-- Screenshot -->
                <div
                    class="w-full mx-auto aspect-video bg-stone-100 border border-stone-200 rounded-3xl p-8"
                >
                    <img
                        :src="
                            item.screenshotUrl ||
                            '~/assets/images/screenshot.png'
                        "
                        :alt="`Screenshot for ${item.message}`"
                        class="w-full h-full object-contain rounded-2xl"
                    />
                </div>

                <!-- Message Content -->
                <div class="space-y-2">
                    <h4 class="text-xl font-semibold text-stone-900">
                        {{ item.message }}
                    </h4>
                    <p class="text-sm text-stone-600">
                        Reported on {{ formatDate(item.createdAt) }}
                    </p>
                </div>

                <!-- Comments Section -->
                <div class="space-y-4">
                    <h5 class="text-lg font-semibold text-stone-900">
                        Comments
                    </h5>

                    <!-- Loading State -->
                    <div v-if="isLoadingComments" class="text-center py-8">
                        <div
                            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"
                        ></div>
                        <p class="text-sm text-stone-500 mt-2">
                            Loading comments...
                        </p>
                    </div>

                    <!-- Existing Comments -->
                    <div v-else-if="comments.length > 0" class="space-y-3">
                        <div
                            v-for="comment in comments"
                            :key="comment.id"
                            class="bg-stone-50 rounded-xl p-4 space-y-2"
                        >
                            <div class="flex items-start justify-between">
                                <div class="flex items-center gap-x-2">
                                    <Avatar
                                        size="xs"
                                        :src="comment.author.avatar"
                                        :id="comment.author.id"
                                        :name="comment.author.name"
                                    />
                                    <span class="text-sm font-medium">
                                        {{ comment.author?.name || "Unknown" }}
                                    </span>
                                    <span
                                        v-if="comment.isInternal"
                                        class="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded"
                                    >
                                        Internal
                                    </span>
                                </div>
                                <span class="text-xs text-stone-500">
                                    {{ formatDate(comment.createdAt) }}
                                </span>
                            </div>
                            <p class="text-sm text-stone-700">
                                {{ comment.content }}
                            </p>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="text-sm text-stone-500 text-center py-8">
                        No comments yet. Be the first to add one!
                    </div>

                    <!-- Add Comment Form -->
                    <div class="space-y-2">
                        <Textarea
                            v-model="message"
                            placeholder="Add a comment..."
                            rows="3"
                            :disabled="isSubmitting"
                        />
                        <div class="flex justify-end">
                            <Button
                                @click="addComment"
                                :loading="isSubmitting"
                                :disabled="!message.trim()"
                            >
                                Send Comment
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Panel -->
            <div class="w-1/4 flex flex-col shrink-0 overflow-y-auto gap-y-6">
                <!-- Reporter Info -->
                <div>
                    <span class="font-mono text-xs text-stone-600 mb-2 block">
                        Reported by:
                    </span>
                    <div class="w-full rounded-2xl bg-stone-100 py-4 px-3">
                        <div class="flex gap-x-3">
                            <Avatar :src="PlagueMaskIcon" size="sm" />
                            <div class="min-w-0 flex-1">
                                <p
                                    class="text-sm font-medium leading-tight truncate"
                                >
                                    {{ item.email || "Anonymous" }}
                                </p>
                                <span class="font-mono text-stone-500 text-xs">
                                    {{ formatDate(item.createdAt) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Issue Actions -->
                <div class="flex flex-col gap-y-3">
                    <!-- Type -->
                    <div class="flex items-center gap-x-2">
                        <span class="text-sm font-medium text-stone-700"
                            >Type:</span
                        >
                        <div class="flex items-center gap-x-1">
                            <img
                                :src="BugIcon"
                                alt="Type icon"
                                class="size-5"
                            />
                            <span class="text-sm">{{ item.type.label }}</span>
                        </div>
                    </div>

                    <!-- Status Dropdown -->
                    <div class="flex items-center gap-x-2">
                        <span class="text-sm font-medium text-stone-700"
                            >Status:</span
                        >
                        <select
                            :value="item.status"
                            @change="
                                updateStatus(
                                    ($event.target as HTMLSelectElement).value
                                )
                            "
                            class="text-sm rounded-lg border border-stone-200 px-2 py-1"
                        >
                            <option
                                v-for="option in statusOptions"
                                :key="option.value"
                                :value="option.value"
                            >
                                {{ option.label }}
                            </option>
                        </select>
                    </div>

                    <!-- Assignee -->
                    <div class="flex items-center gap-x-2">
                        <span class="text-sm font-medium text-stone-700"
                            >Assignee:</span
                        >
                        <div class="flex items-center gap-x-1">
                            <Avatar size="xs" />
                            <span class="text-sm">
                                {{ item.assignedTo || "Unassigned" }}
                            </span>
                        </div>
                    </div>

                    <!-- Priority (if available) -->
                    <div v-if="item.priority" class="flex items-center gap-x-2">
                        <span class="text-sm font-medium text-stone-700"
                            >Priority:</span
                        >
                        <span class="text-sm">{{ item.priority }}</span>
                    </div>
                </div>

                <!-- Technical Details Tabs -->
                <div>
                    <TabGroup>
                        <TabList
                            :class="
                                cn(
                                    selectorGroupVariants({
                                        orientation: 'horizontal',
                                    })
                                )
                            "
                        >
                            <Tab
                                v-for="tab in tabs"
                                :key="tab.key"
                                v-slot="{ selected }"
                                as="template"
                            >
                                <button
                                    :class="cn(selectorVariants({ selected }))"
                                >
                                    <img
                                        :src="tab.icon"
                                        alt=""
                                        class="size-5"
                                    />
                                    {{ tab.label }}
                                </button>
                            </Tab>
                        </TabList>

                        <TabPanels class="mt-4">
                            <!-- Session Tab -->
                            <TabPanel class="flex flex-col gap-y-3">
                                <div class="flex items-start gap-x-2">
                                    <img
                                        :src="LinkIcon"
                                        alt="Link icon"
                                        class="size-5 mt-0.5"
                                    />
                                    <div class="min-w-0 flex-1">
                                        <span
                                            class="text-xs font-medium text-stone-600 block mb-1"
                                        >
                                            Page URL
                                        </span>
                                        <a
                                            :href="item.pageUrl"
                                            target="_blank"
                                            class="text-sm text-blue-600 hover:underline break-all"
                                        >
                                            {{ item.pageUrl }}
                                        </a>
                                    </div>
                                </div>

                                <div class="flex items-center gap-x-2">
                                    <img
                                        :src="VintageComputerIcon"
                                        alt="OS icon"
                                        class="size-5"
                                    />
                                    <div>
                                        <span
                                            class="text-xs font-medium text-stone-600 block"
                                        >
                                            Operating System
                                        </span>
                                        <span class="text-sm">{{
                                            item.os
                                        }}</span>
                                    </div>
                                </div>

                                <div class="flex items-center gap-x-2">
                                    <img
                                        :src="BrowserIcon"
                                        alt="Browser icon"
                                        class="size-5"
                                    />
                                    <div>
                                        <span
                                            class="text-xs font-medium text-stone-600 block"
                                        >
                                            Browser
                                        </span>
                                        <span class="text-sm">
                                            {{ item.browser }}
                                            {{ item.browserVersion }}
                                        </span>
                                    </div>
                                </div>

                                <div class="flex items-center gap-x-2">
                                    <img
                                        :src="OledDisplayIcon"
                                        alt="Display icon"
                                        class="size-5"
                                    />
                                    <div>
                                        <span
                                            class="text-xs font-medium text-stone-600 block"
                                        >
                                            Viewport
                                        </span>
                                        <span class="text-sm">
                                            {{ item.viewportWidth }} ×
                                            {{ item.viewportHeight }}
                                        </span>
                                    </div>
                                </div>

                                <div class="flex items-center gap-x-2">
                                    <img
                                        :src="PixelDisplayIcon"
                                        alt="Pixel icon"
                                        class="size-5"
                                    />
                                    <div>
                                        <span
                                            class="text-xs font-medium text-stone-600 block"
                                        >
                                            Pixel Ratio
                                        </span>
                                        <span class="text-sm"
                                            >{{ item.devicePixelRatio }}x</span
                                        >
                                    </div>
                                </div>
                            </TabPanel>

                            <!-- Custom Data Tab -->
                            <TabPanel class="flex flex-col gap-y-3">
                                <div
                                    v-if="
                                        item.metadata &&
                                        Object.keys(item.metadata).length > 0
                                    "
                                >
                                    <div
                                        v-for="(value, key) in item.metadata"
                                        :key="key"
                                        class="flex items-center gap-x-2 mb-3"
                                    >
                                        <div>
                                            <span
                                                class="text-xs font-medium text-stone-600 block capitalize"
                                            >
                                                {{ key }}
                                            </span>
                                            <span class="text-sm">{{
                                                value
                                            }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-else
                                    class="text-sm text-stone-500 text-center py-8"
                                >
                                    No custom data available
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </div>
            </div>
        </div>
    </Modal>
</template>
