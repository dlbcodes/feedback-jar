<template>
    <caption
        data-slot="table-caption"
        :class="cn('text-muted-foreground mt-4 text-sm', className)"
        v-bind="attrs"
    >
        <slot />
    </caption>
</template>

<script setup lang="ts">
import { useAttrs } from "vue";

defineProps<{ className?: string }>();
const attrs = useAttrs();
</script>
