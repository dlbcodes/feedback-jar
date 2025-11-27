<script setup lang="ts">
const props = defineProps<{
    class?: string;
}>();
</script>

<template>
    <div
        class="flex flex-col w-full p-1 justify-center bg-stone-100 border border-stone-200 rounded-3xl shadow-xs overflow-hidden dark:bg-dark-900 dark:border-black dark:shadow-[inset_-1px_1px_2px_0px_rgba(71,71,71,0.56)]"
    >
        <slot name="header"></slot>
        <div
            :class="
                cn(
                    'h-full overflow-hidden p-2 bg-white shadow-xs rounded-[20px] dark:bg-dark-950 dark:border dark:border-black dark:shadow-[inset_-1px_1px_2px_0px_rgba(71,71,71,0.56)]',
                    props.class
                )
            "
        >
            <slot></slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>
