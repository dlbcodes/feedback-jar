<script setup lang="ts">
const props = defineProps<{
    class?: string;
}>();
</script>

<template>
    <div :class="cn('inline-flex items-center gap-1', props.class)">
        <slot />
    </div>
</template>
