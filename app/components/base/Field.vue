<script setup lang="ts">
const props = defineProps<{
    id: string;
    label?: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    help?: string;
}>();

provide(
    "field",
    computed(() => {
        return {
            ...props,
            invalid: !!props.error,
        };
    })
);
</script>

<template>
    <div>
        <span
            class="text-stone-600 dark:text-dark-300 text-sm"
            v-if="props.label"
            >{{ props.label }}</span
        >
        <slot></slot>

        <Error v-if="props.error">{{ props.error }}</Error>
        <Helper v-if="props.help">{{ props.help }}</Helper>
    </div>
</template>
