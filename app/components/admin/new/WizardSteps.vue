<script setup lang="ts">
import { CheckIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { VintageComputerIcon, CodeIcon, EyeIcon } from "~/assets/images/icons";

defineProps<{
    completedSteps: Record<number, boolean>;
    currentStep: number;
}>();

const steps = [
    { label: "Add site", icon: VintageComputerIcon },
    { label: "Install script", icon: CodeIcon },
    { label: "Waiting event", icon: EyeIcon },
];
</script>

<template>
    <div class="flex items-center gap-1 mb-8">
        <template v-for="(step, index) in steps" :key="step.label">
            <!-- Step -->
            <div
                class="flex items-center gap-x-2 px-4 py-2"
                :class="{
                    'opacity-100': currentStep >= index + 1,
                    'opacity-50': currentStep < index + 1,
                }"
            >
                <img
                    :src="step.icon"
                    :alt="`${step.label} icon`"
                    class="size-6"
                />
                <span class="font-medium text-sm text-stone-900">
                    {{ step.label }}
                </span>

                <CheckIcon
                    v-if="currentStep > index + 1"
                    class="size-4 stroke-3 text-green-600"
                />
            </div>

            <!-- Chevron (except after last item) -->
            <ChevronRightIcon
                v-if="index < steps.length - 1"
                class="size-5 text-stone-400"
            />
        </template>
    </div>
</template>
