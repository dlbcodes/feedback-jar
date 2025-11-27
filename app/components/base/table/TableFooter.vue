<template>
    <tfoot
        data-slot="table-footer"
        :class="
            cn(
                'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
                className
            )
        "
        v-bind="attrs"
    >
        <slot />
    </tfoot>
</template>

<script setup lang="ts">
import { useAttrs } from "vue";

defineProps<{ className?: string }>();
const attrs = useAttrs();
</script>
