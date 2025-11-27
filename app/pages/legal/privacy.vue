<script setup lang="ts">
definePageMeta({
    layout: "marketing",
    middleware: "guest",
});

useHead({
    title: "Privacy Policy | Graphio",
    meta: [
        {
            name: "description",
            content:
                "Your privacy matters. Learn how Graphio collects, uses, and protects your information.",
        },
        { property: "og:title", content: "Privacy Policy | Graphio" },
        {
            property: "og:description",
            content:
                "Your privacy matters. Learn how Graphio collects, uses, and protects your information.",
        },
        { property: "og:url", content: "https://yourdomain.com/privacy" },
        { property: "og:type", content: "website" },
    ],
});
</script>

<template>
    <NuxtLayout> This is Privacy policy </NuxtLayout>
</template>
