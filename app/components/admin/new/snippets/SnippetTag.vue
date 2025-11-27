<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        websiteId?: string;
        website?: string;
    }>(),
    {
        websiteId: "<YOUR_SITE_ID>",
        website: "<YOUR_WEBSITE>",
    }
);
</script>

<template>
    <pre
        ref="codeRef"
        class="shiki tailwindcss-theme whitespace-pre-wrap break-words"
        style="background-color: transparent; color: var(--color-slate-50)"
        tabindex="0"
    >
        <code><span class="line"><span style="color:var(--color-pink-400)">&lt;script</span></span><span class="line">  <span style="color:var(--color-yellow-400)">defer</span></span><span class="line">  <span style="color:var(--color-sky-300)">data-website-id</span>=<span style="color:var(--color-amber-200)">"{{ websiteId }}"</span></span><span class="line">  <span style="color:var(--color-sky-300)">data-domain</span>=<span style="color:var(--color-amber-200)">"{{ website }}"</span></span><span class="line">  <span style="color:var(--color-sky-300)">src</span>=<span style="color:var(--color-amber-200)">"https://datomi.app/js/script.js"</span>&gt;</span><span class="line"><span style="color:var(--color-pink-400)">&lt;/script&gt;</span></span></code>
      </pre>
</template>
