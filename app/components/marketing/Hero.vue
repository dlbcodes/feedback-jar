<script setup lang="ts">
import { GlobeIcon, AlertIcon } from "~/assets/images/icons";

import { FlameIcon } from "~/assets/images/icons";

const submit = () => {
    console.log("cenas");
};
</script>

<template>
    <!-- Hero -->
    <section class="flex flex-col gap-y-6 max-w-4xl mx-auto pt-10 pb-10">
        <!-- Eyebrow -->
        <div
            class="w-fit inline-flex items-center font-mono text-sm tracking-tight bg-stone-50 px-4 py-1 rounded-full dark:bg-dark-900 dark:border-black dark:text-dark-100 dark:shadow-[inset_-1px_1px_2px_0px_rgba(71,71,71,0.56)]"
        >
            <img :src="FlameIcon" alt="Flame icon" class="size-5 shrink-0" />
            <span
                class="font-mono tracking-tight bg-linear-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-amber-500 bg-clip-text text-sm font-bold text-transparent"
            >
                Get feedback straight from your users
            </span>
        </div>
        <!-- End Eyebrow -->

        <!-- Title -->
        <div class="flex flex-col justify-between gap-y-4">
            <h1
                class="font-mono uppercase text-4xl tracking-tighter md:text-3xl lg:text-5xl font-bold text-stone-950 dark:text-dark-100"
            >
                Instant feedback. Zero setup.
            </h1>
            <p
                class="font-mono tracking-tight text-balance text-stone-600 dark:text-dark-400"
            >
                Embed one line of JS — get bug reports, screenshots, and context
                right in your dashboard. No code hassle, no fluff.
            </p>
        </div>
        <!-- End Title -->

        <Button to="/waitlist" class="w-fit">
            Join waitlist
            <AnimatedArrow />
        </Button>
        <!-- Cta buttons -->
        <!-- <div class="flex flex-col items-center gap-y-2">
            <label
                class="flex bg-stone-100 border-2 border-stone-100 rounded-2xl h-12 py-1 pl-2 pr-1 overflow-hidden focus-within:border-black dark:focus-within:border-dark-400 dark:bg-dark-900 dark:text-dark-200"
            >
                <span class="flex items-center">
                    <img
                        :src="GlobeIcon"
                        alt="Globe icon"
                        class="size-8 shrink-0"
                    />
                    <span class="text-stone-600">https://</span>
                </span>
                <input
                    type="text"
                    placeholder="website.com"
                    class="w-full outline-none"
                />
                <button
                    @click="submit"
                    class="flex items-center gap-x-2 text-sm bg-indigo-600 hover:bg-indigo-800 rounded-xl px-4 font-medium stroke-stone-50 text-stone-50 whitespace-nowrap"
                >
                    Add website
                    <AnimatedArrow />
                </button>
            </label>
            <span
                class="flex items-center gap-x-1 text-sm font-mono font-medium tracking-tight dark:text-dark-300"
            >
                <img
                    :src="AlertIcon"
                    alt=""
                    class="size-5 shrink-0 select-none"
                />
                No credit card required!
            </span>
        </div> -->

        <div
            class="border border-stone-200 bg-stone-100 rounded-4xl overflow-hidden"
        >
            <img src="~/assets/images/screenshot.png" alt="" />
        </div>
    </section>
    <!-- End Hero -->
</template>
