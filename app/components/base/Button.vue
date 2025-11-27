<script setup lang="ts">
import { buttonVariants, type ButtonProps } from "~/variants/ButtonVariants";

// Define props with default values
const props = withDefaults(
    defineProps<{
        variant?: ButtonProps["variant"];
        size?: ButtonProps["size"];
        class?: string | string[];
        to?: string;
        type?: "button" | "submit" | "reset";
        loading?: boolean;
    }>(),
    {
        variant: "primary",
        size: "base",
        to: undefined,
        type: "button",
        loading: false,
    }
);

// Determine the component type (button or NuxtLink) based on the presence of the `to` prop
const componentToDisplay = computed(() =>
    props.to ? resolveComponent("NuxtLink") : "button"
);

// Conditional classes based on loading state
const buttonClasses = computed(() => [
    buttonVariants({ variant: props.variant, size: props.size }),
    props.class,
]);

// Check if the component should render as a link
const isLink = computed(() => Boolean(props.to));
</script>

<template>
    <component
        :is="componentToDisplay"
        :to="isLink ? props.to : undefined"
        :type="isLink ? undefined : props.type"
        :class="cn(buttonClasses)"
        :disabled="props.loading"
    >
        <div
            class="w-full flex justify-center items-center gap-x-4 -translate-y-px opacity-100 transition-all duration-100 ease-linear group-hover:translate-y-0 group-hover:opacity-90"
        >
            <!-- Conditionally render loading spinner or slot content -->
            <slot v-if="!props.loading"></slot>
            <span v-else>Loading...</span>
        </div>
    </component>
</template>
