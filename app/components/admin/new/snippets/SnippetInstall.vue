<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        websiteId?: string;
        apiKey?: string;
    }>(),
    {
        websiteId: "<YOUR_SITE_ID>",
        apiKey: "<YOUR_API_KEY>",
    }
);
</script>

<template>
    <pre
        ref="codeRef"
        class="shiki tailwindcss-theme whitespace-pre-wrap break-words"
        style="background-color: transparent; color: var(--color-slate-50)"
        tabindex="0"
    ><code><span class="line"><span style="color:var(--color-slate-300)">import</span><span style="color:var(--color-slate-50)"> {</span><span style="color:var(--color-sky-300)"> Analytics</span><span style="color:var(--color-slate-50)">,</span><span style="color:var(--color-sky-300)"> analytics</span><span style="color:var(--color-slate-50)">,</span><span style="color:var(--color-sky-300)"> initAnalytics</span><span style="color:var(--color-slate-50)"> }</span><span style="color:var(--color-slate-300)"> from</span><span style="color:var(--color-slate-200)"> "datomi-sdk"</span></span><span class="line"></span><span class="line"><span style="color:var(--color-sky-300)">initAnalytics</span><span style="color:var(--color-slate-50)">(</span><span style="color:var(--color-slate-400)">{</span></span><span class="line -mx-5 pl-[calc(var(--spacing)*5-2px)] border-l-2 border-sky-400 bg-sky-300/15"><span style="color:var(--color-slate-50)">  projectId:</span><span style="color:var(--color-amber-200)"> "{{ websiteId }}"</span><span style="color:var(--color-slate-400)">,</span></span><span class="line"><span style="color:var(--color-slate-50)">  apiKey:</span><span style="color:var(--color-amber-200)"> "{{ apiKey }}"</span><span style="color:var(--color-slate-400)">,</span></span><span class="line"><span style="color:var(--color-slate-400)">}</span><span style="color:var(--color-slate-50)">)</span></span><span class="line"></span><span class="line"><span style="color:var(--color-sky-300)">analytics</span><span style="color:var(--color-slate-50)">.</span><span style="color:var(--color-teal-300)">track</span><span style="color:var(--color-slate-50)">(</span><span style="color:var(--color-amber-200)">"app_loaded"</span><span style="color:var(--color-slate-50)">,</span><span style="color:var(--color-slate-400)"> { </span><span style="color:var(--color-sky-300)">message</span><span style="color:var(--color-slate-50)">:</span><span style="color:var(--color-amber-200)"> "App.vue loaded"</span><span style="color:var(--color-slate-400)"> }</span><span style="color:var(--color-slate-50)">)</span></span></code></pre>
</template>
