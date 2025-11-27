<script setup lang="ts">
defineProps<{
    websiteId?: string;
}>();
</script>

<template>
    <Panel class="flex flex-col gap-y-4 pt-10 px-10 h-96">
        <Header
            title="You’re live!"
            subtitle="Waiting for your first event to arrive..."
        />
        <div
            class="flex flex-col items-center justify-center text-center py-8 text-stone-500 h-full"
        >
            <div class="relative flex items-center justify-center">
                <!-- Radar circles -->
                <span
                    class="absolute inline-flex h-32 w-32 animate-ping rounded-full bg-sky-400/30 opacity-75"
                    style="animation-duration: 2s"
                ></span>
                <span
                    class="absolute inline-flex h-24 w-24 animate-ping rounded-full bg-sky-400/40 opacity-75"
                    style="animation-duration: 1.5s"
                ></span>
                <span
                    class="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-sky-400/50 opacity-75"
                    style="animation-duration: 1s"
                ></span>

                <!-- Eye icon in center -->
                <img
                    src="~/assets/images/icons/eye.png"
                    alt=""
                    class="relative size-14 z-18 shrink-0"
                />
            </div>
            <Button
                :to="`/admin/${websiteId}`"
                class="w-fit place-content-end mt-auto"
            >
                Go to dashboard
                <AnimatedArrow />
            </Button>
        </div>
    </Panel>
</template>
