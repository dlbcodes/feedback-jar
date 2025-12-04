<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";

const isProd = process.env.NODE_ENV === "production";

const scriptSrc = isProd
    ? "https://datomi.app/feedbackjar.js"
    : "http://localhost:3000/feedbackjar.js";

const apiEndpoint = isProd
    ? "https://www.datomi.app/api/v1/feedback"
    : "http://localhost:3000/api/v1/feedback";

const apiTypesEndpoint = isProd
    ? "https://www.datomi.app/api/v1/feedback/types"
    : "http://localhost:3000/api/v1/feedback/types";

const apiMessagesEndpoint = isProd
    ? "https://www.datomi.app/api/v1/feedback/messages"
    : "http://localhost:3000/api/v1/feedback/messages";

const scriptKey = isProd
    ? "cmihoylrp0003l104naaczfsw"
    : "cmih915qu00050z84sdjhg3ly";
const position = "top-right";

useHead({
    script: [
        {
            src: scriptSrc,
            defer: true,
            "data-api-endpoint": apiEndpoint,
            "data-script-key": scriptKey,
            "data-types-endpoint": apiTypesEndpoint,
            "data-route-messages-endpoint": apiMessagesEndpoint,
            "data-position": position,
        },
    ],
});
</script>

<template>
    <div>
        <NuxtPage />
        <ToastProvider />
        <CookieConsent />
        <Analytics v-if="isProd" />
    </div>
</template>
