<script setup lang="ts">
import { ref, reactive, watch, defineProps, defineEmits } from "vue";
import {
    EyeIcon,
    CodeBracketIcon,
    Squares2X2Icon,
    UnderlineIcon,
    PhotoIcon,
    LinkIcon,
    SwatchIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["update:modelValue"]);

const messageType = ref(props.modelValue.messageType || "builder");
const displayType = ref(props.modelValue.displayType || "popover");
const message = ref(props.modelValue.message || "");
const messageHtml = ref(props.modelValue.messageHtml || "");
const blocks = ref(props.modelValue.builderData?.blocks || []);
const theme = reactive(
    props.modelValue.theme || {
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        ctaColor: "#4f39f6",
    }
);
const showPreview = ref(false);

const blockTypes = [
    { id: "heading", label: "Heading", icon: UnderlineIcon },
    { id: "text", label: "Text", icon: UnderlineIcon },
    { id: "image", label: "Image", icon: PhotoIcon },
    { id: "button", label: "Button", icon: LinkIcon },
];

function addBlock(type: string) {
    const newBlock = {
        id: Date.now(),
        type,
        content:
            type === "heading"
                ? "New Heading"
                : type === "text"
                ? "Your message here..."
                : type === "button"
                ? "Click here"
                : "",
        config:
            type === "image"
                ? { url: "", alt: "" }
                : type === "button"
                ? { url: "#", style: "primary" }
                : {},
    };
    blocks.value = [...blocks.value, newBlock];
    updateModel();
}

function updateBlock(id: number, updates: any) {
    blocks.value = blocks.value.map((block) =>
        block.id === id ? { ...block, ...updates } : block
    );
    updateModel();
}

function deleteBlock(id: number) {
    blocks.value = blocks.value.filter((block) => block.id !== id);
    updateModel();
}

function moveBlock(id: number, direction: string) {
    const index = blocks.value.findIndex((b) => b.id === id);
    if (direction === "up" && index > 0) {
        const newBlocks = [...blocks.value];
        [newBlocks[index], newBlocks[index - 1]] = [
            newBlocks[index - 1],
            newBlocks[index],
        ];
        blocks.value = newBlocks;
    } else if (direction === "down" && index < blocks.value.length - 1) {
        const newBlocks = [...blocks.value];
        [newBlocks[index], newBlocks[index + 1]] = [
            newBlocks[index + 1],
            newBlocks[index],
        ];
        blocks.value = newBlocks;
    }
    updateModel();
}

function generateHtml() {
    return blocks.value
        .map((block) => {
            switch (block.type) {
                case "heading":
                    return `<h2 style="margin: 0 0 12px 0; font-weight: 600;">${block.content}</h2>`;
                case "text":
                    return `<p style="margin: 0 0 12px 0;">${block.content}</p>`;
                case "image":
                    return `<img src="${block.config.url}" alt="${block.config.alt}" style="max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 12px;" />`;
                case "button":
                    return `<a href="${block.config.url}" style="display: inline-block; padding: 10px 20px; background: ${theme.ctaColor}; color: white; text-decoration: none; border-radius: 6px; margin-bottom: 12px;">${block.content}</a>`;
                default:
                    return "";
            }
        })
        .join("\n");
}

function copyHtml() {
    const html = generateHtml();
    navigator.clipboard.writeText(html);
    alert("HTML copied to clipboard!");
}

function updateModel() {
    emit("update:modelValue", {
        messageType: messageType.value,
        displayType: displayType.value,
        message: message.value,
        messageHtml: messageHtml.value,
        builderData: { blocks: blocks.value },
        theme,
    });
}

watch(
    [messageType, displayType, message, messageHtml, blocks, () => theme],
    updateModel,
    { deep: true }
);
</script>

<template>
    <div class="max-w-6xl mx-auto p-6">
        <div class="mb-6">
            <h1 class="text-2xl font-bold mb-4">Message Builder</h1>

            <!-- Message Type Selector -->
            <div class="flex gap-2 mb-4">
                <button
                    @click="messageType = 'text'"
                    :class="[
                        'px-4 py-2 rounded-lg',
                        messageType === 'text'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100',
                    ]"
                >
                    Plain Text
                </button>
                <button
                    @click="messageType = 'html'"
                    :class="[
                        'px-4 py-2 rounded-lg',
                        messageType === 'html'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100',
                    ]"
                >
                    <CodeBracketIcon class="w-4 h-4 inline mr-2" />
                    HTML
                </button>
                <button
                    @click="messageType = 'builder'"
                    :class="[
                        'px-4 py-2 rounded-lg',
                        messageType === 'builder'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100',
                    ]"
                >
                    <Squares2X2Icon class="w-4 h-4 inline mr-2" />
                    Visual Builder
                </button>
            </div>

            <!-- Display Type -->
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2"
                    >Display Type</label
                >
                <select
                    v-model="displayType"
                    class="w-full px-3 py-2 border rounded-lg"
                >
                    <option value="popover">Popover</option>
                    <option value="banner">Banner</option>
                    <option value="toast">Toast</option>
                    <option value="modal">Modal</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Editor -->
            <div class="bg-white rounded-xl border p-6">
                <h2 class="text-lg font-semibold mb-4">Edit Message</h2>

                <textarea
                    v-if="messageType === 'text'"
                    v-model="message"
                    placeholder="Enter your plain text message..."
                    class="w-full h-64 px-3 py-2 border rounded-lg font-mono text-sm"
                />

                <textarea
                    v-else-if="messageType === 'html'"
                    v-model="messageHtml"
                    placeholder="<h2>Your HTML here</h2><p>Supports full HTML</p>"
                    class="w-full h-64 px-3 py-2 border rounded-lg font-mono text-sm"
                />

                <div v-else>
                    <!-- Block Palette -->
                    <div class="mb-4 pb-4 border-b">
                        <p class="text-sm text-gray-600 mb-2">Add blocks:</p>
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="blockType in blockTypes"
                                :key="blockType.id"
                                @click="addBlock(blockType.id)"
                                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-2"
                            >
                                <component
                                    :is="blockType.icon"
                                    class="w-4 h-4"
                                />
                                {{ blockType.label }}
                            </button>
                        </div>
                    </div>

                    <!-- Blocks -->
                    <div class="space-y-3 max-h-96 overflow-y-auto">
                        <p
                            v-if="blocks.length === 0"
                            class="text-gray-400 text-center py-8"
                        >
                            Add blocks to start building your message
                        </p>

                        <div
                            v-for="block in blocks"
                            :key="block.id"
                            class="border rounded-lg p-3 bg-gray-50"
                        >
                            <div class="flex justify-between items-start mb-2">
                                <span
                                    class="text-xs font-medium text-gray-500 uppercase"
                                >
                                    {{ block.type }}
                                </span>
                                <div class="flex gap-1">
                                    <button
                                        @click="moveBlock(block.id, 'up')"
                                        class="px-2 py-1 text-xs hover:bg-gray-200 rounded"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        @click="moveBlock(block.id, 'down')"
                                        class="px-2 py-1 text-xs hover:bg-gray-200 rounded"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        @click="deleteBlock(block.id)"
                                        class="px-2 py-1 text-xs hover:bg-red-100 text-red-600 rounded"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            <input
                                v-if="
                                    ['heading', 'text', 'button'].includes(
                                        block.type
                                    )
                                "
                                v-model="block.content"
                                :placeholder="`Enter ${block.type} text...`"
                                class="w-full px-2 py-1 border rounded text-sm mb-2"
                            />

                            <div
                                v-if="block.type === 'image'"
                                class="space-y-2"
                            >
                                <input
                                    v-model="block.config.url"
                                    placeholder="Image URL"
                                    class="w-full px-2 py-1 border rounded text-sm"
                                />
                                <input
                                    v-model="block.config.alt"
                                    placeholder="Alt text"
                                    class="w-full px-2 py-1 border rounded text-sm"
                                />
                            </div>

                            <input
                                v-if="block.type === 'button'"
                                v-model="block.config.url"
                                placeholder="Button URL"
                                class="w-full px-2 py-1 border rounded text-sm"
                            />
                        </div>
                    </div>
                </div>

                <!-- Theme Customization -->
                <div class="mt-6 pt-6 border-t">
                    <h3
                        class="text-sm font-medium mb-3 flex items-center gap-2"
                    >
                        <SwatchIcon class="w-4 h-4" />
                        Theme
                    </h3>
                    <div class="grid grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs mb-1">Background</label>
                            <input
                                type="color"
                                v-model="theme.backgroundColor"
                                class="w-full h-8 rounded border cursor-pointer"
                            />
                        </div>
                        <div>
                            <label class="block text-xs mb-1">Text</label>
                            <input
                                type="color"
                                v-model="theme.textColor"
                                class="w-full h-8 rounded border cursor-pointer"
                            />
                        </div>
                        <div>
                            <label class="block text-xs mb-1">CTA</label>
                            <input
                                type="color"
                                v-model="theme.ctaColor"
                                class="w-full h-8 rounded border cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Preview -->
            <div class="bg-gray-50 rounded-xl border p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-semibold">Preview</h2>
                    <button
                        @click="showPreview = !showPreview"
                        class="px-3 py-1 bg-white border rounded-lg text-sm flex items-center gap-2"
                    >
                        <EyeIcon class="w-4 h-4" />
                        {{ showPreview ? "Hide" : "Show" }}
                    </button>
                </div>

                <div
                    v-if="showPreview"
                    class="bg-white rounded-lg p-6 shadow-lg"
                    :style="{
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor,
                    }"
                >
                    <p
                        v-if="messageType === 'text'"
                        class="whitespace-pre-wrap"
                    >
                        {{ message || "Your message will appear here..." }}
                    </p>

                    <div
                        v-else-if="messageType === 'html'"
                        v-html="
                            messageHtml ||
                            '<p>Your HTML will appear here...</p>'
                        "
                    />

                    <div
                        v-else
                        v-html="
                            generateHtml() ||
                            '<p>Add blocks to see preview...</p>'
                        "
                    />
                </div>

                <!-- Export HTML -->
                <div
                    v-if="messageType === 'builder' && blocks.length > 0"
                    class="mt-4 pt-4 border-t"
                >
                    <button
                        @click="copyHtml"
                        class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                    >
                        <CodeBracketIcon class="w-4 h-4" />
                        Copy HTML
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Optional: add any extra styles you want */
</style>
