<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";

useAppShortcut("Cmd+Shift+L", () => {
    toggleDark();
});

const isDark = ref(false); // default to dark

let toggleDark = () => {}; // placeholder for SSR

onMounted(() => {
    const dark = useDark({
        selector: "html",
        attribute: "class",
        valueDark: "dark",
        valueLight: "light",
        storageKey: "theme",
        initialValue: "light", // 👈 This makes dark default
    });

    isDark.value = dark.value;

    watch(dark, (val) => {
        isDark.value = val;
    });

    toggleDark = useToggle(dark);
});
</script>

<template>
    <span
        class="relative w-fit z-0 inline-grid grid-cols-2 gap-0.5 p-0.75 rounded-full bg-stone-100 border border-stone-200 shadow-xs dark:bg-dark-900 dark:border-black dark:shadow-[inset_-1px_1px_2px_0px_rgba(71,71,71,0.56)]"
    >
        <!-- Moon (for dark mode) -->
        <span
            @click="isDark || toggleDark()"
            :class="[
                isDark
                    ? 'dark:text-dark-300 dark:bg-dark-950 dark:border-black dark:shadow-[inset_-1px_1px_2px_0px_rgba(71,71,71,0.56)] border-stone-200 text-stone-950'
                    : '',
                'cursor-pointer rounded-full p-1.5 shrink-0 border border-transparent *:size-5 *:shrink-0 text-stone-600 dark:text-dark-400',
            ]"
        >
            <MoonIcon />
        </span>

        <!-- Sun (for light mode) -->
        <span
            @click="!isDark || toggleDark()"
            :class="[
                !isDark ? 'bg-white text-stone-950 border-stone-200!' : '',
                'cursor-pointer rounded-full p-1.5 shrink-0 border border-transparent *:size-5 *:shrink-0 text-stone-600 dark:text-dark-400',
            ]"
        >
            <SunIcon />
        </span>
    </span>
</template>
