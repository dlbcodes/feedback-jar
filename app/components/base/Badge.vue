<script setup lang="ts">
import { badgeVariants, type BadgeProps } from "~/variants/BadgeVariants";

const props = withDefaults(
    defineProps<{
        variant?: BadgeProps["variant"];
        // size?: BadgeProps["size"];
        class?: string | string[];
    }>(),
    {
        variant: "primary",
    }
);
</script>

<template>
    <div :class="cn(badgeVariants({ variant }), props.class)">
        <slot></slot>
    </div>
</template>
