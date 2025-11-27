<script setup lang="ts">
const props = defineProps<{
    class?: string;
}>();
</script>

<template>
    <kbd
        :class="
            cn(
                'bg-stone-200 text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none',
                props.class
            )
        "
    >
        <slot />
    </kbd>
</template>
