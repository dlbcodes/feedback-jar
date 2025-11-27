<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon, PlusIcon } from "@heroicons/vue/20/solid";

defineProps<{
    question: string;
    answer: string;
}>();
</script>

<template>
    <Disclosure
        v-slot="{ open }"
        as="div"
        class="w-full flex flex-col items-center gap-x-2 px-4 py-2 rounded-2xl bg-white transition"
    >
        <DisclosureButton
            class="flex w-full justify-between items-center rounded-lg px-4 py-3 text-left font-medium text-stone-900 dark:text-stone-100"
        >
            <span>{{ question }}</span>
            <PlusIcon
                :class="[
                    'h-5 w-5 text-stone-500 transition-transform duration-200',
                    open ? 'rotate-45 transform' : '',
                ]"
            />
        </DisclosureButton>

        <DisclosurePanel
            class="px-4 pb-4 pt-2 text-sm text-stone-600 dark:text-stone-300"
        >
            {{ answer }}
        </DisclosurePanel>
    </Disclosure>
</template>
