<script setup lang="ts">
import { useToast, useToastState } from "@/composables/useToast";
import { buttonVariants } from "~/variants/ButtonVariants";
import {
    XMarkIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    XCircleIcon,
} from "@heroicons/vue/24/outline";

const toasts = useToastState();
const { removeToast } = useToast();

const toastIconClasses = {
    success: "text-green-500",
    error: "text-red-700",
    warning: "text-yellow-500",
    info: "text-blue-500",
} as const;

const toastIcons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
} as const;

const positionClasses = {
    "top-right": "top-5 right-5",
    "top-left": "top-5 left-5",
    "bottom-right": "bottom-5 right-5",
    "bottom-left": "bottom-5 left-5",
} as const;
</script>

<template>
    <Teleport to="body">
        <TransitionGroup name="toast">
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="fixed z-[100000]"
                :class="toast.position ? positionClasses[toast.position] : ''"
                @click="removeToast(toast.id)"
            >
                <Panel
                    class="max-w-sm group pointer-events-auto flex gap-x-2 w-full items-center justify-between space-x-2 overflow-hidden p-4 pr-6"
                >
                    <component
                        v-if="toast.type && toastIcons[toast.type]"
                        :is="toastIcons[toast.type]"
                        class="size-8"
                        :class="toastIconClasses[toast.type]"
                    />

                    <div class="flex-1">
                        <p
                            v-if="toast.title"
                            class="block text-base/6 text-stone-950 font-medium truncate text-ellipsis whitespace-nowrap overflow-hidden max-w-full dark:text-dark-100"
                        >
                            {{ toast.title }}
                        </p>
                        <p
                            class="text-stone-500 font-mono tracking-tight text-xs font-medium dark:text-dark-400"
                        >
                            {{ toast.message }}
                        </p>
                    </div>
                    <!-- Close button -->

                    <button
                        @click.stop="removeToast(toast.id)"
                        :class="
                            cn(
                                buttonVariants({
                                    variant: 'icon',
                                    size: 'icon',
                                })
                            )
                        "
                    >
                        <XMarkIcon class="size-4" />
                    </button>
                </Panel>
            </div>
        </TransitionGroup>
    </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.toast-move {
    transition: transform 0.3s ease;
}
</style>
