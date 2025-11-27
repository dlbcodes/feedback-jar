<script setup lang="ts">
const props = defineProps<{ class?: string }>();
</script>

<template>
    <thead
        :class="
            cn(
                '[&_tr]:border-b [&_tr]:border-stone-200 bg-stone-100',
                props.class
            )
        "
    >
        <slot />
    </thead>
</template>
