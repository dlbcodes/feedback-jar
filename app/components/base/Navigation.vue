<script setup lang="ts">
import { navigationVariants } from "~/variants/NavigationVariants";

interface NavItem {
    href: string;
    label: string;
    icon: Component | string;
}

const props = defineProps<{
    label?: string;
    items: NavItem[];
}>();
</script>

<template>
    <nav class="flex flex-col min-h-0 overflow-y-auto gap-y-1">
        <div
            v-if="props.label"
            class="text-xs font-medium text-stone-500 px-1 whitespace-nowrap"
        >
            {{ label }}
        </div>
        <NuxtLink
            v-for="item in props.items"
            :key="item.href"
            :to="item.href"
            :class="cn(navigationVariants({ variant: 'primary' }))"
        >
            <div class="flex items-center gap-x-1 min-w-0">
                <template v-if="item.icon">
                    <img
                        v-if="typeof item.icon === 'string'"
                        :src="item.icon"
                        class="size-6 shrink-0"
                        :alt="item.label"
                    />
                    <component v-else :is="item.icon" class="size-5 shrink-0" />
                </template>
                <span class="truncate">{{ item.label }}</span>
            </div>
        </NuxtLink>
    </nav>
</template>
