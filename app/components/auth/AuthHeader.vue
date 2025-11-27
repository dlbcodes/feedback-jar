<script setup lang="ts">
import { buttonVariants } from "~/variants/ButtonVariants";

const props = defineProps<{
    tagline?: string;
    title?: string;
    message?: string;
    to?: string;
    label?: string;
}>();
</script>

<template>
    <div class="text-center">
        <p
            class="font-mono text-xs/6 font-medium tracking-widest text-gray-600 uppercase dark:text-gray-400"
        >
            {{ tagline }}
        </p>

        <h1
            class="text-4xl/10 font-bold tracking-tight text-gray-950 dark:text-white"
        >
            {{ title }}
        </h1>

        <p class="text-sm/6 text-gray-600 dark:text-gray-400 mt-4">
            {{ message }}
            <NuxtLink
                :to="to"
                :class="
                    cn(
                        buttonVariants({
                            variant: 'link',
                            size: 'none',
                        })
                    )
                "
            >
                {{ label }}
            </NuxtLink>
        </p>
    </div>
</template>
