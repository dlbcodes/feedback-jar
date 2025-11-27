<script setup lang="ts">
const { createCheckout } = useSubscription();

// access env vars correctly in Nuxt 3
const config = useRuntimeConfig();

console.log(config.public.STRIPE_PRO_PRICE_ID);

const upgrade = (tier: "pro" | "enterprise") => {
    const priceId =
        tier === "pro"
            ? config.public.STRIPE_PRO_PRICE_ID
            : config.public.STRIPE_ENTERPRISE_PRICE_ID;

    createCheckout(priceId, tier);
};
</script>

<template>
    <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
        <!-- Free -->
        <div class="border rounded-lg p-6">
            <h3 class="text-xl font-bold">Free</h3>
            <p class="text-3xl font-bold my-4">
                $0<span class="text-sm">/mo</span>
            </p>
            <ul class="space-y-2 mb-6">
                <li>✓ 1 project</li>
                <li>✓ 10k events/month</li>
            </ul>
            <button
                disabled
                class="w-full bg-gray-200 text-gray-500 py-2 rounded"
            >
                Current Plan
            </button>
        </div>

        <!-- Pro -->
        <div class="border-2 border-blue-500 rounded-lg p-6 relative">
            <div
                class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
                Popular
            </div>
            <h3 class="text-xl font-bold">Pro</h3>
            <p class="text-3xl font-bold my-4">
                $29<span class="text-sm">/mo</span>
            </p>
            <ul class="space-y-2 mb-6">
                <li>✓ 10 projects</li>
                <li>✓ 100k events/month</li>
                <li>✓ Priority support</li>
            </ul>
            <button
                @click="upgrade('pro')"
                class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
                Upgrade to Pro
            </button>
        </div>

        <!-- Enterprise -->
        <div class="border rounded-lg p-6">
            <h3 class="text-xl font-bold">Enterprise</h3>
            <p class="text-3xl font-bold my-4">
                $99<span class="text-sm">/mo</span>
            </p>
            <ul class="space-y-2 mb-6">
                <li>✓ Unlimited projects</li>
                <li>✓ 1M events/month</li>
                <li>✓ Dedicated support</li>
            </ul>
            <button
                @click="upgrade('enterprise')"
                class="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
            >
                Upgrade to Enterprise
            </button>
        </div>
    </div>
</template>
