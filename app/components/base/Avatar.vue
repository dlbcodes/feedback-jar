<script setup lang="ts">
import { avatarVariants, type AvatarProps } from "~/variants/AvatarVariants";

const props = withDefaults(
    defineProps<{
        size?: AvatarProps["size"];
        src?: string | null;
        name?: string | null;
        id?: string | number | null;
        class?: string;
    }>(),
    {
        size: "base",
        name: "",
    }
);

const initialLetter = computed(() => {
    return props.name !== null ? props.name.slice(0, 1) : "X";
});

const imageUrl = computed(() => {
    if (props.src && props.id) {
        return `${props.id}/avatar/${props.src}`;
    }
    return null;
});

// Add a key to force re-render when src changes
const imageKey = computed(() => props.src || "default");
</script>

<template>
    <div :class="cn(avatarVariants({ size }), props.class)">
        <NuxtImg
            v-if="imageUrl"
            :key="imageKey"
            provider="cloudfront"
            :src="imageUrl"
            alt="Avatar"
            class="object-cover w-full h-full rounded-full overflow-hidden"
        />
        <div
            v-else
            class="flex justify-center items-center aspect-square h-full w-full"
        >
            {{ initialLetter }}
        </div>
    </div>
</template>
