<template>
    <tbody
        data-slot="table-body"
        :class="cn('[&_tr:last-child]:border-0', className)"
        v-bind="attrs"
    >
        <slot />
    </tbody>
</template>

<script setup lang="ts">
import { useAttrs } from "vue";

defineProps<{ className?: string }>();
const attrs = useAttrs();
</script>
