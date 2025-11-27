<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { Float } from "@headlessui-float/vue";
import { navigationVariants } from "~/variants/NavigationVariants";
import { popoverVariants, type PopoverProps } from "~/variants/PopoverVariants";

interface DropdownOption {
    label: string;
    action: () => void;
    icon?: any;
    disabled?: boolean;
}

const props = withDefaults(
    defineProps<{
        variant?: PopoverProps["variant"];
        size?: PopoverProps["size"];
        options: DropdownOption[];
        class?: string;
        buttonLabel?: string;
    }>(),
    {
        variant: "primary",
        type: "text",
        size: "fit",
        loading: false,
        buttonLabel: "Options",
    }
);

const handleOptionClick = (action: () => void, close: Function) => {
    action();
    close();
};
</script>

<template>
    <Menu as="span" :class="cn('relative inline-flex text-left', props.class)">
        <Float
            placement="bottom-end"
            :offset="0"
            flip
            shift
            :z-index="99999"
            portal
        >
            <!-- Button (Reference Element) -->
            <MenuButton v-slot="{ open }" class="leading-none">
                <div
                    :class="[
                        open
                            ? '[&>*:first-child]:bg-gray-950/5 [&>*:first-child]:dark:bg-white/10'
                            : '',
                    ]"
                >
                    <slot></slot>
                </div>
            </MenuButton>

            <!-- Dropdown (Floating Element) -->
            <Transition
                enter="transition ease-out duration-200"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
            >
                <MenuItems :class="cn(popoverVariants({ variant, size }))">
                    <div class="py-1">
                        <MenuItem
                            v-for="(option, index) in options"
                            :key="index"
                            class="w-full"
                            v-slot="{ active, close }"
                        >
                            <button
                                @click.prevent="
                                    handleOptionClick(option.action, close)
                                "
                                :disabled="option.disabled"
                                :class="
                                    cn(
                                        navigationVariants({
                                            variant: 'contrast',
                                        })
                                    )
                                "
                            >
                                <img
                                    v-if="typeof option.icon === 'string'"
                                    :src="option.icon"
                                    class="size-5 hrink-0"
                                    :alt="option.label"
                                />
                                <component
                                    v-else
                                    :is="option.icon"
                                    class="w-4 h-4 shrink-0"
                                />
                                {{ option.label }}
                            </button>
                        </MenuItem>
                    </div>
                </MenuItems>
            </Transition>
        </Float>
    </Menu>
</template>
