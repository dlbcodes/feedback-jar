<script setup lang="ts">
interface Props {
    modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
}>();

const loading = ref(true);
const errors = ref<string | null>(null);
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
</script>

<template>
    <Modal
        :modelValue="modelValue"
        title="Add message"
        size="full"
        @update:modelValue="$emit('update:modelValue', $event)"
    >
        <div class="space-y-6">
            <div class="grid grid-cols-2 gap-x-12">
                <!-- Builder -->
                <div class="">
                    <div class="flex gap-x-2">
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

                        <Field
                            id="match-type"
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
                            label="Priority"
                            type="number"
                            :error="errors?.priority"
                        >
                            <Input v-model="form.priority" />
                        </Field>
                    </div>
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

                    <div class="flex items-center gap-2">
                        <input type="checkbox" v-model="form.isActive" />
                        <label>Active</label>
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
                                    <span class="text-stone-500"
                                        >https://cenas.com</span
                                    >
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
        </div>
    </Modal>
</template>
