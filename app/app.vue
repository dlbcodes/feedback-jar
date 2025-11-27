<script setup lang="ts">
useHead({
    script: [
        {
            src: "http://localhost:3000/feedbackjar.js",
            defer: true,
            "data-api-endpoint": "http://localhost:3000/api/v1/feedback",
            "data-script-key": "cmig1187a00010zxtic4fe5il",
            "data-position": "top-right",
        },
    ],
});
</script>

<template>
    <div>
        <NuxtPage />
    </div>
</template>
