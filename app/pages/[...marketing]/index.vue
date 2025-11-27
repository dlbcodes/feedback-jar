<script setup lang="ts">
import {
    FunnelIcon,
    ZapIcon,
    DashboardIcon,
    PlugAdapaterIcon,
    CursorIcon,
    AlertIcon,
    BugIcon,
    VintageComputerIcon,
    CodeIcon,
    BrowserIcon,
    FeedbackIcon,
    WindIcon,
} from "~/assets/images/icons";

usePageMeta();

definePageMeta({
    layout: "marketing",
    middleware: "guest",
});
</script>

<template>
    <NuxtLayout>
        <Hero />

        <section class="w-full max-w-4xl mx-auto text-left">
            <h2
                class="text-3xl font-mono font-bold tracking-tight uppercase mb-2"
            >
                Built for devs shipping fast
            </h2>
            <p class="font-mono text-stone-600">
                You don’t have time to fight a giant dashboard or navigate 40
                tabs. <br />
                You need answers quick — not an analytics PhD.
            </p>
        </section>

        <section class="w-full max-w-4xl mx-auto text-left">
            <h2
                class="text-3xl font-mono font-bold tracking-tight uppercase mb-2"
            >
                Real feedback (not noise)
            </h2>
            <p class="font-mono text-stone-600">
                Every submission captures full context — URL, browser, OS,
                viewport, metadata. Skip the "works on my machine" mysteries.
            </p>
        </section>

        <section class="w-full max-w-4xl mx-auto text-left">
            <h2
                class="text-3xl font-mono font-bold tracking-tight uppercase mb-2"
            >
                Screenshot + context in one click
            </h2>
            <p class="font-mono text-stone-600">
                Users don’t need to describe what went wrong. A single click
                captures a screenshot with all relevant data. You get clarity —
                fast.
            </p>
        </section>

        <section class="w-full max-w-4xl mx-auto text-left">
            <h2
                class="text-3xl font-mono font-bold tracking-tight uppercase mb-2"
            >
                Private by default — no data leaks
            </h2>
            <p class="font-mono text-stone-600">
                You own your data. No tracking cookies, no creepy analytics
                trackers. Just honest feedback, transparently.
            </p>
        </section>

        <section class="w-full max-w-4xl mx-auto text-left">
            <h2
                class="text-3xl font-mono font-bold tracking-tight uppercase mb-2"
            >
                Easy install — one line of code
            </h2>
            <p class="font-mono text-stone-600">
                Add the script tag, paste your scriptKey, and you’re good. Works
                on any website — static pages, SaaS, server-rendered apps, even
                client-only.
            </p>
        </section>

        <section class="w-full max-w-4xl mx-auto text-left">
            <div class="grid grid-cols-3 gap-6">
                <!-- Frictionless Reports -->
                <div>
                    <img
                        :src="BugIcon"
                        alt="Bug icon"
                        class="size-12 shrink-0"
                    />
                    <h5 class="text-xl font-mono font-bold tracking-tight mb-2">
                        Frictionless bug reports
                    </h5>
                    <p class="font-mono text-stone-600">
                        Users submit feedback without thinking — one click,
                        instant context, no forms.
                    </p>
                </div>

                <!-- Automatic Context -->
                <div>
                    <img
                        :src="VintageComputerIcon"
                        alt="Context icon"
                        class="size-12 shrink-0"
                    />
                    <h5 class="text-xl font-mono font-bold tracking-tight mb-2">
                        Full context, automatically
                    </h5>
                    <p class="font-mono text-stone-600">
                        Page URL, browser, OS, viewport, device — everything
                        captured for every report.
                    </p>
                </div>

                <!-- Screenshots -->
                <div>
                    <img
                        :src="BrowserIcon"
                        alt="Screenshot icon"
                        class="size-12 shrink-0"
                    />
                    <h5 class="text-xl font-mono font-bold tracking-tight mb-2">
                        Instant screenshots
                    </h5>
                    <p class="font-mono text-stone-600">
                        Users capture visual proof instantly, so you can fix the
                        exact issue they see.
                    </p>
                </div>

                <!-- Developer-Friendly -->
                <div>
                    <img
                        :src="CodeIcon"
                        alt="Terminal icon"
                        class="size-12 shrink-0"
                    />
                    <h5 class="text-xl font-mono font-bold tracking-tight mb-2">
                        Built for developers
                    </h5>
                    <p class="font-mono text-stone-600">
                        Copy–paste the snippet and forget it. No config, no SDK
                        heavy lifting.
                    </p>
                </div>

                <!-- Feedback Types -->
                <div>
                    <img
                        :src="FeedbackIcon"
                        alt="Tags icon"
                        class="size-12 shrink-0"
                    />
                    <h5 class="text-xl font-mono font-bold tracking-tight mb-2">
                        Custom feedback types
                    </h5>
                    <p class="font-mono text-stone-600">
                        Bug, feature, UX issue — or create your own labels to
                        organize issues your way.
                    </p>
                </div>

                <!-- Fast Setup -->
                <div>
                    <img
                        :src="ZapIcon"
                        alt="Lightning icon"
                        class="size-12 shrink-0"
                    />
                    <h5 class="text-xl font-mono font-bold tracking-tight mb-2">
                        Up and running in minutes
                    </h5>
                    <p class="font-mono text-stone-600">
                        Add one script tag. Get feedback flowing. No dashboard
                        chaos, no complexity.
                    </p>
                </div>
            </div>
        </section>

        <section
            class="flex flex-col items-center w-full max-w-4xl mx-auto text-center rounded-4xl bg-stone-900 py-20 bg-[repeating-linear-gradient(135deg,#202020_0px,#202020_1px,transparent_1px,transparent_20px)]"
        >
            <h2
                class="text-4xl font-mono font-bold text-stone-200 text-center tracking-tight uppercase mb-2"
            >
                Build smarter. Ship faster.
            </h2>
            <p class="font-mono text-gray-400 max-w-2xl mx-auto mb-12">
                One script, one click, every detail you need to debug faster.
            </p>
            <Button to="/waitlist" class="w-fit">
                Start for Free
                <AnimatedArrow />
            </Button>
            <span
                class="flex items-center gap-x-1 text-sm font-mono font-medium tracking-tight text-stone-300 mt-2"
            >
                <img
                    :src="AlertIcon"
                    alt=""
                    class="size-5 shrink-0 select-none"
                />
                No credit card required!
            </span>
        </section>
    </NuxtLayout>
</template>
