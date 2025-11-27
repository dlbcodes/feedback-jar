<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { buttonVariants } from "~/variants/ButtonVariants";

defineProps<{
    side?: "top" | "right" | "bottom" | "left";
    class?: string;
}>();

const emit = defineEmits(["close"]);

const open = ref(false);

const openSheet = () => (open.value = true);
const closeSheet = () => {
    open.value = false;
    emit("close");
};

const positionClasses = computed(() => ({
    right: "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm border-l border-stone-50 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0",
    left: "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm border-r data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0",
    top: "inset-x-0 top-0 h-auto border-b data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0",
    bottom: "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:translate-y-full data-[state=open]:translate-y-0",
}));
</script>

<template>
    <div>
        <!-- Trigger slot -->
        <slot name="trigger" :open="openSheet"></slot>

        <!-- Overlay -->
        <transition name="fade">
            <div
                v-if="open"
                class="fixed inset-0 z-50 bg-black/0 transition-opacity"
                @click="closeSheet"
            />
        </transition>

        <!-- Content -->
        <transition name="slide">
            <div
                v-if="open"
                :class="
                    cn(
                        positionClasses[side || 'right'],
                        'fixed z-50 flex flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out'
                    )
                "
            >
                <button
                    @click="closeSheet"
                    :class="
                        cn(
                            buttonVariants({
                                variant: 'icon',
                                size: 'icon',
                            }),
                            'absolute top-4 right-4 '
                        )
                    "
                    aria-label="Close modal"
                >
                    <XMarkIcon class="size-4" />
                    <span class="sr-only">Close</span>
                </button>

                <div class="flex flex-col gap-1.5 p-4">
                    <slot name="header"></slot>
                </div>

                <div class="flex-1 overflow-auto p-4">
                    <slot></slot>
                </div>

                <div class="mt-auto flex flex-col gap-2 p-4">
                    <slot name="footer"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease-in-out;
}
.slide-enter-from[data-side="right"],
.slide-leave-to[data-side="right"] {
    transform: translateX(100%);
}
.slide-enter-from[data-side="left"],
.slide-leave-to[data-side="left"] {
    transform: translateX(-100%);
}
.slide-enter-from[data-side="top"],
.slide-leave-to[data-side="top"] {
    transform: translateY(-100%);
}
.slide-enter-from[data-side="bottom"],
.slide-leave-to[data-side="bottom"] {
    transform: translateY(100%);
}
</style>
