<script setup lang="ts">
import {
    buttonGroupVariants,
    type ButtonGroupVariantsProps,
} from "~/variants/ButtonGroupVariants";

const props = defineProps<{
    orientation?: ButtonGroupVariantsProps["orientation"];
    class?: string;
}>();
</script>

<template>
    <div :class="[cn(buttonGroupVariants({ orientation }), props.class)]">
        <slot></slot>
    </div>
</template>
