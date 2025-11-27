<script setup lang="ts">
const props = defineProps<{
    title: string;
    subtitle?: string;
}>();
</script>

<template>
    <div>
        <h1 class="text-xl/6 font-semibold text-stone-950 dark:text-dark-100">
            {{ title }}
        </h1>
        <p v-if="subtitle" class="text-sm/6 text-stone-600 dark:text-dark-400">
            {{ subtitle }}
        </p>
    </div>
</template>
