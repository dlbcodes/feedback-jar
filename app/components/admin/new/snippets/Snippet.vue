<script setup lang="ts">
import { ref } from "vue";
import { useClipboard } from "@vueuse/core";

const contentRef = ref<HTMLElement | null>(null);
const { copy, copied } = useClipboard();

const copyCode = () => {
    if (!contentRef.value) return;

    // Get all the line spans
    const lines = contentRef.value.querySelectorAll(".line");

    // Extract text from each line and join with newlines
    const text = Array.from(lines)
        .map((line) => line.textContent?.trim() || "")
        .join("\n");

    copy(text);
};
</script>

<template>
    <div class="relative">
        <button
            @click="copyCode"
            class="absolute top-2 right-2 bg-stone-700 hover:bg-stone-600 text-white text-xs px-2 py-1 rounded z-10 transition-colors"
        >
            {{ copied ? "Copied!" : "Copy" }}
        </button>

        <div
            ref="contentRef"
            class="bg-stone-950 text-sm rounded-xl *:flex *:*:shrink-0 *:overflow-auto *:rounded-lg *:bg-white/10! *:p-5 dark:*:bg-white/5! **:[.line]:isolate **:[.line]:block **:[.line]:not-last:min-h-[1lh] *:inset-ring *:inset-ring-white/10 dark:*:inset-ring-white/5"
        >
            <slot />
        </div>
    </div>
</template>
