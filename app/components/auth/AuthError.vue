<script setup lang="ts">
const props = defineProps<{
    error: string | string[] | null;
}>();
</script>

<template>
    <div
        v-if="error"
        class="w-full rounded-lg mb-4 py-4 text-center text-sm text-red-800 border border-red-400 bg-red-300"
    >
        {{ error }}
    </div>
</template>
