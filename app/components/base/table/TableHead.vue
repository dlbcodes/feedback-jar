<template>
    <th
        data-slot="table-head"
        :class="
            cn(
                'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                className
            )
        "
        v-bind="attrs"
    >
        <slot />
    </th>
</template>

<script setup lang="ts">
import { useAttrs } from "vue";

defineProps<{ className?: string }>();
const attrs = useAttrs();
</script>
