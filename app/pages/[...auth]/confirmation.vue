<script setup lang="ts">
usePageMeta({
  title: "Confirm Your Email",
  description:
    "Verify your email address to activate your Graphio account and unlock all features.",
})

definePageMeta({
    layout: "base",
    middleware: "guest",
});
</script>

<template>
    <NuxtLayout>
        <div class="flex p-12">
            <Logo />
        </div>
        <div class="max-w-xl p-10 lg:p-12 mx-auto">
            <h1
                class="text-4xl/10 font-bold tracking-tight text-gray-950 dark:text-white"
            >
                Thanks for signing up
            </h1>
            <p class="mt-6 text-base/7 text-gray-700 dark:text-gray-300">
                Confirm your email to start your onboarding. If you can't find
                our email, check your spam folder. A small percentage of emails
                land there.
            </p>
        </div>
    </NuxtLayout>
</template>
