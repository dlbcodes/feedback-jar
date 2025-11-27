<script setup lang="ts">
const props = defineProps<{ class?: string }>();
</script>

<template>
    <div data-slot="table-container" class="relative w-full">
        <table
            :class="
                cn(
                    'w-full caption-bottom text-sm rounded-2xl border-collapse',
                    props.class
                )
            "
        >
            <slot />
        </table>
    </div>
</template>
