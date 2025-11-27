<script setup lang="ts">
interface Option {
    label: string;
    value: string;
}

interface Props {
    options: Option[];
    modelValue?: string;
    defaultValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
    defaultValue: "7d",
});

const emit = defineEmits<{
    "update:modelValue": [value: string];
}>();

const selected = computed({
    get: () => props.modelValue || props.defaultValue,
    set: (value) => emit("update:modelValue", value),
});
</script>

<template>
    <Radio :options="options" v-model="selected" />
</template>
