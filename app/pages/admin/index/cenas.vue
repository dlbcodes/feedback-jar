<script setup lang="ts">
import { SpaceCatIcon } from "~/assets/images/icons";
</script>

<template>
    <div class="flex flex-col min-h-screen w-full">
        <header class="flex justify-between px-8 py-6">
            <Logo />
        </header>

        <div
            class="flex flex-col gap-y-6 items-center text-center w-full max-w-3xl mx-auto py-10"
        >
            <img :src="SpaceCatIcon" alt="" class="size-60 shrink-0" />
            <div>
                <h4
                    class="text-4xl/10 font-bold tracking-tight text-stone-950 dark:text-white"
                >
                    Uh oh, an untracked event!
                </h4>
                <p class="text-base/6 text-stone-600 dark:text-stone-400 mt-2">
                    We looked everywhere, but this page never tracked. Let’s
                    head back before the dashboard gets confused.
                </p>
            </div>
            <Button to="/" class="w-fit">
                Go back to homepage
                <AnimatedArrow />
            </Button>
        </div>
    </div>
</template>
