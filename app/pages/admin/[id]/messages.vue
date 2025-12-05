<script setup lang="ts">
import { ChevronLeftIcon, BookmarkIcon } from "@heroicons/vue/24/outline";

const route = useRoute();
const projectId = route.params.id as string;

const projectsStore = useProjectsStore();

const loading = ref(true);
const error = ref<string | null>(null);
const messages = ref<any[]>([]);

const form = ref({
    route: "",
    // This holds the whole complex message data from the builder:
    messageData: {
        messageType: "text",
        displayType: "popover",
        message: "",
        messageHtml: "",
        builderData: { blocks: [] },
        theme: {
            backgroundColor: "#ffffff",
            textColor: "#1f2937",
            ctaColor: "#4f39f6",
        },
    },
    matchType: "exact",
    priority: 0,
    isActive: true,
});

async function fetchMessages() {
    loading.value = true;
    error.value = null;
    try {
        const res = await $fetch(`/api/v1/projects/${projectId}/messages`);
        messages.value = res.routeMessages;
    } catch (err: any) {
        error.value = err?.data?.statusMessage || "Failed to load messages.";
    } finally {
        loading.value = false;
    }
}

async function createMessage() {
    try {
        const res = await $fetch(`/api/v1/projects/${projectId}/messages`, {
            method: "POST",
            body: {
                projectId,
                route: form.value.route,
                message: form.value.messageData.message,
                messageHtml: form.value.messageData.messageHtml,
                messageType: form.value.messageData.messageType,
                builderData: form.value.messageData.builderData,
                displayType: form.value.messageData.displayType,
                theme: form.value.messageData.theme,
                matchType: form.value.matchType,
                priority: form.value.priority,
                isActive: form.value.isActive,
            },
        });

        messages.value.unshift(res.routeMessage);

        // Reset form
        form.value = {
            route: "",
            messageData: {
                messageType: "text",
                displayType: "popover",
                message: "",
                messageHtml: "",
                builderData: { blocks: [] },
                theme: {
                    backgroundColor: "#ffffff",
                    textColor: "#1f2937",
                    ctaColor: "#4f39f6",
                },
            },
            matchType: "exact",
            priority: 0,
            isActive: true,
        };
    } catch (err: any) {
        alert(err?.data?.statusMessage || "Could not create route message.");
    }
}

onMounted(fetchMessages);

const matchTypeItems = [
    {
        label: "Exact",
        value: "exact",
    },
    {
        label: "Starts with",
        value: "startsWith",
    },
    {
        label: "Contains",
        value: "contains",
    },
];

const showCreateMessageModal = ref(false);
</script>

<template>
    <div class="p-6 w-full mx-auto">
        <AdminHeader title="Route Messages" :show-refresh="false" />
        <!-- <Button @click="showCreateMessageModal = true">Show modal</Button> -->

        <div v-if="loading" class="text-gray-500">Loading messages...</div>

        <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

        <div class="grid grid-cols-2 gap-x-8">
            <!-- Builder -->
            <div class="rounded-xl p-4 mb-8 bg-white">
                <h2 class="font-medium text-lg mb-4">Add Message</h2>

                <div @submit.prevent="createMessage" class="space-y-4">
                    <Field
                        id="route"
                        class="flex-1"
                        label="Route"
                        placeholder="/pricing"
                        type="text"
                        :error="errors?.route"
                    >
                        <Input v-model="form.route" />
                    </Field>

                    <!-- Use your message builder here -->
                    <MessageBuilder v-model="form.messageData" />

                    <Field
                        id="match-type"
                        class="flex-1"
                        label="Match type"
                        :error="errors?.matchType"
                    >
                        <Listbox
                            :options="matchTypeItems"
                            v-model="form.matchType"
                        />
                    </Field>

                    <Field
                        id="priority"
                        class="flex-1"
                        label="Match type"
                        type="number"
                        :error="errors?.priority"
                    >
                        <Input v-model="form.priority" />
                    </Field>

                    <div class="flex items-center gap-2">
                        <input type="checkbox" v-model="form.isActive" />
                        <label>Active</label>
                    </div>

                    <Button @click="createMessage"> Add message </Button>
                </div>
            </div>
            <!-- End Builder -->

            <!-- Preview -->

            <div
                class="w-full rounded-2xl overflow-hidden border border-stone-100 p-1 bg-stone-100"
            >
                <!-- Browser header -->
                <div class="w-full flex flex-col gap-x-1 bg-stone-100">
                    <div class="flex gap-x-1 px-4 py-2">
                        <span
                            class="size-3 shrink-0 rounded-full bg-[#ff5f58]"
                        ></span>
                        <span
                            class="size-3 shrink-0 rounded-full bg-[#febc2e]"
                        ></span>
                        <span
                            class="size-3 shrink-0 rounded-full bg-[#29c83f]"
                        ></span>
                    </div>
                    <div class="flex items-center gap-x-8 pl-4 py-2">
                        <div class="flex gap-x-2">
                            <ChevronLeftIcon
                                class="size-5 shrink-0 text-stone-600"
                            />
                            <ChevronLeftIcon
                                class="size-5 shrink-0 rotate-180 text-stone-600"
                            />
                        </div>
                        <div class="flex flex-1 items-center gap-x-1">
                            <BookmarkIcon
                                class="size-5 shrink-0 text-stone-600"
                            />
                            <div
                                class="flex flex-1 text-base bg-white px-2 py-1 rounded-lg"
                            >
                                <span class="text-stone-500">{{
                                    projectsStore.currentProject?.domain ||
                                    "https://example.com"
                                }}</span>
                                {{ form.route }}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End Browser header -->

                <div
                    class="relative w-full bg-white shadow-xs h-[400px] rounded-xl"
                >
                    <div
                        class="absolute bottom-2 right-2 size-12 shadow rounded-full bg-indigo-600"
                    ></div>
                </div>
            </div>
            <!-- End Preview -->
        </div>

        <div>
            <h2 class="font-medium text-lg mb-4">Existing Messages</h2>

            <div v-if="messages.length === 0" class="text-gray-500">
                No messages yet.
            </div>

            <div
                v-for="msg in messages"
                :key="msg.id"
                class="border rounded-xl p-4 mb-3 bg-white shadow-sm"
            >
                <div class="flex justify-between items-start">
                    <div>
                        <div class="font-semibold">{{ msg.route }}</div>

                        <div v-if="msg.messageType === 'builder'">
                            <div
                                v-html="
                                    msg.messageHtml || 'No preview available'
                                "
                            ></div>
                        </div>

                        <div v-else class="text-gray-600 text-sm">
                            {{ msg.message }}
                        </div>

                        <div class="mt-1 text-xs text-gray-500">
                            match: {{ msg.matchType }} • priority:
                            {{ msg.priority }} • active:
                            {{ msg.isActive ? "yes" : "no" }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <CreateMessageModal v-model="showCreateMessageModal" />
</template>
