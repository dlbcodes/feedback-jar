<script setup lang="ts">
import { ref, computed, watch, toRef } from "vue";
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/vue";
import {
    ChevronUpDownIcon,
    CheckIcon,
    MagnifyingGlassIcon,
} from "@heroicons/vue/20/solid";
import { popoverVariants, type PopoverProps } from "~/variants/PopoverVariants";
import { inputVariants, type InputProps } from "~/variants/InputVariants";

interface Option {
    label: string;
    value: string;
}

const props = defineProps<{
    modelValue: string;
    options: Option[];
    placeholder?: string;
    searchable?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const query = ref("");

// Create internal model
const internalValue = computed({
    get: () => props.modelValue,
    set: (val: string) => {
        console.log("Listbox value changed to:", val);
        emit("update:modelValue", val);
    },
});

const filteredOptions = computed(() => {
    if (!props.searchable || !query.value.trim()) return props.options;
    return props.options.filter((opt) =>
        opt.label.toLowerCase().includes(query.value.toLowerCase())
    );
});

// Find the label for the selected value
const selectedOption = computed(() => {
    const found = props.options.find((o) => o.value === props.modelValue);
    console.log("Selected option:", { modelValue: props.modelValue, found });
    return found || null;
});

// Reset search when value changes
watch(
    () => props.modelValue,
    (newVal) => {
        console.log("ModelValue changed to:", newVal);
        query.value = "";
    }
);

// Debug on mount
onMounted(() => {
    console.log("Listbox mounted with:", {
        modelValue: props.modelValue,
        optionsCount: props.options.length,
        selectedOption: selectedOption.value,
    });
});
</script>

<template>
    <div class="relative w-full">
        <Listbox v-model="internalValue">
            <div class="relative">
                <!-- Button -->
                <ListboxButton
                    as="div"
                    :class="
                        cn(
                            inputVariants({
                                variant: 'primary',
                            })
                        )
                    "
                >
                    <span class="block truncate">
                        {{
                            selectedOption?.label ||
                            placeholder ||
                            "Select an option"
                        }}
                    </span>
                    <span
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                        <ChevronUpDownIcon
                            class="h-5 w-5 text-stone-400"
                            aria-hidden="true"
                        />
                    </span>
                </ListboxButton>

                <!-- Options -->
                <transition
                    enter="transition ease-out duration-100"
                    enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95"
                >
                    <ListboxOptions
                        :class="
                            cn(
                                popoverVariants({
                                    variant: 'primary',
                                    size: 'full',
                                }),
                                'absolute w-full z-50 mt-0.5'
                            )
                        "
                    >
                        <!-- Search bar -->
                        <div
                            v-if="searchable"
                            class="sticky top-0 z-10 bg-white dark:bg-dark-800 px-2 py-2 border-b border-stone-200 dark:border-dark-600 flex items-center gap-x-2"
                        >
                            <MagnifyingGlassIcon
                                class="h-4 w-4 text-stone-400"
                            />
                            <input
                                v-model="query"
                                type="text"
                                placeholder="Search..."
                                class="w-full bg-transparent focus:outline-none text-sm text-stone-700 dark:text-dark-100"
                                @click.stop
                                @keydown.stop
                            />
                        </div>

                        <!-- Options list -->
                        <ListboxOption
                            v-for="option in filteredOptions"
                            :key="option.value"
                            :value="option.value"
                            v-slot="{ active, selected: isSelected }"
                        >
                            <li
                                :class="[
                                    active
                                        ? 'bg-blue-100 dark:bg-dark-700'
                                        : '',
                                    'cursor-pointer select-none relative py-2 pl-3 pr-9',
                                ]"
                            >
                                <span
                                    :class="[
                                        isSelected
                                            ? 'font-semibold'
                                            : 'font-normal',
                                        'block truncate',
                                    ]"
                                >
                                    {{ option.label }}
                                </span>

                                <span
                                    v-if="isSelected"
                                    class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600"
                                >
                                    <CheckIcon
                                        class="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </span>
                            </li>
                        </ListboxOption>

                        <div
                            v-if="filteredOptions.length === 0"
                            class="text-center text-sm text-stone-500 py-3"
                        >
                            No results found
                        </div>
                    </ListboxOptions>
                </transition>
            </div>
        </Listbox>
    </div>
</template>
