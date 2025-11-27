<script setup lang="ts">
import {
    RocketIcon,
    SproutIcon,
    ExperimentTubeIcon,
    QuestionMarkIcon,
    PriceTagIcon,
} from "~/assets/images/icons";
import { faqs } from "~/config/marketing";

usePageMeta({ title: "Pricing" });
definePageMeta({ layout: "marketing", middleware: "guest" });

const plans = {
    pro: {
        icon: RocketIcon,
        title: "Pro",
        subtitle:
            "Built for teams that move quickly. Get instant, context-rich feedback, powerful labels, and a focused dashboard that helps you fix the right things first.",
        price: "14",
        unit: "/month",
        cta: "Start 14-day free trial",
        features: [
            "10k monthly events",
            "10 websites",
            "Email alerts",
            "6 months data retention",
            "6 months data retention",
            "6 months data retention",
        ],
    },
    starter: {
        icon: SproutIcon,
        title: "Starter",
        subtitle: "Perfect for side projects and smaller sites.",
        price: "9",
        unit: "/month",
        cta: "Start free trial",
        features: ["5k monthly events", "1 website", "3 months data retention"],
    },
    free: {
        icon: ExperimentTubeIcon,
        title: "Just to see",
        subtitle: "Test things out and get a feel for it.",
        price: "0",
        unit: "/month",
        cta: "Start free trial",
        features: ["500 monthly events", "1 website", "7 days data retention"],
    },
};
</script>

<template>
    <NuxtLayout>
        <section
            class="flex flex-col gap-y-16 justify-center text-center max-w-5xl mx-auto"
        >
            <div class="flex flex-col items-center justify-center gap-y-4">
                <div
                    class="flex items-center gap-x-1 font-mono w-fit px-2 py-1 rounded-2xl bg-white shadow-xs font-semibold text-sm text-stone-900"
                >
                    <img :src="PriceTagIcon" alt="" class="size-6 shrink-0" />

                    Pricing
                </div>
                <div>
                    <h2
                        class="text-4xl font-mono font-bold text-center tracking-tight uppercase mb-2"
                    >
                        Simple pricing for growing projects
                    </h2>
                    <p class="font-mono text-gray-600 max-w-2xl mx-auto">
                        No complicated setup. Just start tracking and understand
                        your users faster.
                    </p>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6 items-stretch">
                <!-- Pro -->

                <div
                    class="flex flex-col flex-1 h-full dark [&>*:first-child]:h-full"
                >
                    <PricingCard :plan="plans.pro" />
                </div>

                <!-- Starter + Free -->
                <div class="flex flex-col gap-y-6 h-full">
                    <PricingCard :plan="plans.starter" compact />
                    <PricingCard :plan="plans.free" compact />
                </div>
            </div>
        </section>

        <section
            class="flex flex-col justify-center items-center w-full max-w-4xl mx-auto px-4 py-16 space-y-4"
        >
            <div
                class="flex items-center gap-x-1 font-mono w-fit px-2 py-1 rounded-2xl bg-white shadow-xs font-semibold text-sm text-stone-900"
            >
                <img :src="QuestionMarkIcon" alt="" class="size-5 shrink-0" />

                FAQ's
            </div>
            <h2
                class="text-4xl font-mono font-bold text-center tracking-tight mb-8"
            >
                YOU <span class="text-stone-400">(FREQUENTLY)</span> ASK. <br />
                WE ANSWER.
            </h2>

            <Faq
                v-for="(faq, i) in faqs"
                :key="i"
                :question="faq.question"
                :answer="faq.answer"
            />
        </section>
    </NuxtLayout>
</template>
