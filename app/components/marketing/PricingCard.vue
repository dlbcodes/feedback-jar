<script setup lang="ts">
import { CheckIcon } from "@heroicons/vue/24/outline";

defineProps<{
    plan: {
        icon: string;
        title: string;
        subtitle: string;
        price: string;
        unit: string;
        cta: string;
        features: string[];
    };
    compact?: boolean; // used for the smaller (right column) cards
}>();
</script>

<template>
    <Panel class="flex flex-col justify-between h-full">
        <div class="flex flex-col flex-1 justify-between text-left">
            <div
                :class="[
                    'flex flex-col flex-1 justify-between gap-y-8 p-4 dark:bg-dark-900 rounded-2xl',
                    compact && 'flex-row items-center bg-stone-100 p-2 gap-x-4',
                ]"
            >
                <div>
                    <img
                        :src="plan.icon"
                        :alt="`${plan.title} icon`"
                        class="size-8 shrink-0 mb-2"
                    />
                    <h6 class="font-medium text-stone-950 dark:text-stone-100">
                        {{ plan.title }}
                    </h6>
                    <p class="text-stone-600 text-sm dark:text-stone-400">
                        {{ plan.subtitle }}
                    </p>
                </div>

                <div class="flex flex-col gap-y-4 items-start justify-center">
                    <h5
                        :class="[
                            'relative w-fit font-medium dark:text-stone-50',
                            compact ? 'text-4xl' : 'text-6xl',
                        ]"
                    >
                        {{ plan.price }}$
                        <span
                            class="absolute top-1 -right-14 text-base text-stone-400"
                        >
                            {{ plan.unit }}
                        </span>
                    </h5>
                    <Button class="whitespace-nowrap">
                        {{ plan.cta }}
                        <AnimatedArrow />
                    </Button>
                </div>
            </div>

            <div class="p-4">
                <ul
                    class="flex flex-col gap-y-2 text-sm text-stone-950 dark:text-stone-200"
                >
                    <li
                        v-for="feature in plan.features"
                        :key="feature"
                        class="flex items-center gap-x-2"
                    >
                        <CheckIcon class="text-indigo-500 size-4 stroke-3" />
                        <span>{{ feature }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </Panel>
</template>
