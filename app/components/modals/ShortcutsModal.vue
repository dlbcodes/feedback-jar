<script setup lang="ts">
interface Props {
    modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
}>();

const shortcuts = [
    {
        category: "Navigation",
        items: [
            { keys: ["Cmd", "K"], description: "Quick search" },
            { keys: ["Cmd", "Shift", "C"], description: "Toggle sidebar" },
        ],
    },
    {
        category: "General",
        items: [{ keys: ["Escape"], description: "Close modal" }],
    },
];
</script>

<template>
    <Modal
        :modelValue="modelValue"
        title="Keyboard Shortcuts"
        size="md"
        @update:modelValue="$emit('update:modelValue', $event)"
    >
        <div class="space-y-6">
            <div
                v-for="category in shortcuts"
                :key="category.category"
                class="space-y-3"
            >
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ category.category }}
                </h3>
                <div class="space-y-2">
                    <div
                        v-for="(item, idx) in category.items"
                        :key="idx"
                        class="flex items-center justify-between"
                    >
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                            {{ item.description }}
                        </span>
                        <KbdGroup>
                            <Kbd
                                v-for="(key, keyIdx) in item.keys"
                                :key="keyIdx"
                            >
                                {{ key }}
                            </Kbd>
                        </KbdGroup>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
</template>
