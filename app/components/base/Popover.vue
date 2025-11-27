<script setup lang="ts">
import { ref } from "vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { popoverVariants } from "~/variants/InputVariants";
import { Float } from "@headlessui-float/vue";

defineProps<{
    align?: "left" | "right" | "center"; // Alignment options
    width?: string; // Custom width (default: auto)
}>();

const isOpen = ref(false);
</script>

<template>
    <Popover as="div" v-slot="{ open }" class="relative">
        <Float
            placement="bottom-end"
            :offset="8"
            flip
            shift
            :z-index="99999"
            portal
        >
            <!-- Popover Trigger Button -->
            <PopoverButton class="">
                <slot name="button">Open</slot>
            </PopoverButton>

            <!-- Popover Content -->
            <transition
                enter="transition duration-200 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="transition duration-150 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
            >
                <PopoverPanel
                    :class="
                        cn(
                            popoverVariants({
                                popoverVariant: 'primary',
                                popoverSize: 'xs',
                            }),
                            'p-4'
                        )
                    "
                >
                    <slot>Popover Content</slot>
                </PopoverPanel>
            </transition>
        </Float>
    </Popover>
</template>
