<script setup lang="ts">
import { inputVariants, type InputProps } from "~/variants/InputVariants";
import { Float } from "@headlessui-float/vue";

const props = withDefaults(
    defineProps<{
        variant?: InputProps["variant"];
        size?: InputProps["size"];
        id?: string;
        modelValue: string;
        placeholder?: string;
        required?: boolean;
        disabled?: boolean;
        invalid?: boolean;
        class?: string;
        showPresets?: boolean;
    }>(),
    {
        variant: "primary",
        size: "base",
        showPresets: true,
        placeholder: "#000000",
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

// Inject field context (for use with <Field> wrapper)
const field = inject<{
    id?: string;
    invalid?: boolean;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
}>("field", {
    id: props.id,
    invalid: props.invalid,
    required: props.required,
    disabled: props.disabled,
    placeholder: props.placeholder,
});

const isPickerOpen = ref(false);
const inputValue = ref(props.modelValue || "#000000");
const pickerValue = ref(props.modelValue || "#000000");

// Preset colors (common UI colors)
const presetColors = [
    "#000000",
    "#FFFFFF",
    "#6B7280",
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#EAB308",
    "#84CC16",
    "#22C55E",
    "#10B981",
    "#14B8A6",
    "#06B6D4",
    "#0EA5E9",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#A855F7",
    "#D946EF",
    "#EC4899",
    "#F43F5E",
];

// Validate hex color
const isValidHex = (hex: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
};

// Normalize hex (add # if missing, convert 3-digit to 6-digit)
const normalizeHex = (hex: string): string => {
    let normalized = hex.trim();

    // Add # if missing
    if (!normalized.startsWith("#")) {
        normalized = "#" + normalized;
    }

    // Convert 3-digit to 6-digit
    if (normalized.length === 4) {
        normalized =
            "#" +
            normalized[1] +
            normalized[1] +
            normalized[2] +
            normalized[2] +
            normalized[3] +
            normalized[3];
    }

    return normalized.toUpperCase();
};

// Handle input change
const handleInputChange = (value: string) => {
    inputValue.value = value;

    const normalized = normalizeHex(value);
    if (isValidHex(normalized)) {
        pickerValue.value = normalized;
        emit("update:modelValue", normalized);
    }
};

// Handle color picker change
const handlePickerChange = (value: string) => {
    pickerValue.value = value.toUpperCase();
    inputValue.value = value.toUpperCase();
    emit("update:modelValue", value.toUpperCase());
};

// Handle preset click
const selectPreset = (color: string) => {
    pickerValue.value = color;
    inputValue.value = color;
    emit("update:modelValue", color);
    isPickerOpen.value = false;
};

// Sync with parent modelValue changes
watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue && newValue !== inputValue.value) {
            inputValue.value = newValue;
            pickerValue.value = newValue;
        }
    }
);

// Close picker when clicking outside
const pickerRef = ref<HTMLDivElement | null>(null);
const handleClickOutside = (event: MouseEvent) => {
    if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
        isPickerOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});

// Compute if current value is invalid
const isInvalidColor = computed(() => {
    return inputValue.value && !isValidHex(normalizeHex(inputValue.value));
});
</script>

<template>
    <div ref="pickerRef" class="relative">
        <div
            :class="[
                cn(
                    inputVariants({ variant, size }),
                    'p-1',
                    field.invalid || isInvalidColor
                        ? 'bg-red-100 border hover:border-red-600 focus-within:border-red-600 hover:bg-red-200 focus-within:bg-white focus-within:hover:bg-white'
                        : 'hover:shadow-input-hover focus-within:border-black dark:focus-within:border-dark-400',
                    props.class
                ),
            ]"
        >
            <!-- Color preview swatch -->
            <button
                type="button"
                @click="isPickerOpen = !isPickerOpen"
                :disabled="field.disabled"
                class="shrink-0 size-6 rounded-lg border-2 border-stone-200 dark:border-dark-600 shadow-sm transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                :style="{
                    backgroundColor: isValidHex(normalizeHex(inputValue))
                        ? normalizeHex(inputValue)
                        : '#cccccc',
                }"
            >
                <span class="sr-only">Open color picker</span>
            </button>

            <span class="text-stone-600 flex items-center gap-x-1">
                <slot></slot>
            </span>

            <!-- Text input for hex value -->
            <input
                :id="field.id"
                type="text"
                :value="inputValue"
                :required="field.required"
                :disabled="field.disabled"
                :placeholder="field.placeholder"
                maxlength="7"
                class="w-full h-full bg-transparent outline-none text-black/70 group-hover:text-black focus:text-black dark:text-stone-400 dark:group-hover:text-dark-300 dark:focus:text-dark-100 font-mono uppercase"
                @input="
                    handleInputChange(($event.target as HTMLInputElement).value)
                "
                @focus="isPickerOpen = true"
            />
        </div>

        <!-- Color picker dropdown -->
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <Float
                placement="bottom-end"
                :offset="0"
                flip
                shift
                :z-index="99999"
                portal
            >
                <div
                    v-if="isPickerOpen"
                    class="absolute z-50 mt-2 p-4 bg-white dark:bg-dark-800 border border-stone-200 dark:border-dark-600 rounded-xl shadow-2xl w-64"
                >
                    <!-- Native color picker -->
                    <div class="mb-3">
                        <label
                            class="block text-xs font-medium text-stone-600 dark:text-dark-400 mb-2"
                        >
                            Pick a color
                        </label>
                        <input
                            type="color"
                            :value="pickerValue"
                            @input="
                                handlePickerChange(
                                    ($event.target as HTMLInputElement).value
                                )
                            "
                            class="w-full h-10 rounded-lg border-2 border-stone-200 dark:border-dark-600 cursor-pointer"
                        />
                    </div>

                    <!-- Preset colors -->
                    <div v-if="showPresets">
                        <label
                            class="block text-xs font-medium text-stone-600 dark:text-dark-400 mb-2"
                        >
                            Quick colors
                        </label>
                        <div class="grid grid-cols-10 gap-2">
                            <button
                                v-for="color in presetColors"
                                :key="color"
                                type="button"
                                @click="selectPreset(color)"
                                class="size-6 rounded-lg border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                :class="{
                                    'border-stone-400 dark:border-dark-300':
                                        color === pickerValue,
                                    'border-stone-200 dark:border-dark-600':
                                        color !== pickerValue,
                                }"
                                :style="{ backgroundColor: color }"
                                :title="color"
                            >
                                <span class="sr-only">{{ color }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Validation message -->
                    <div
                        v-if="isInvalidColor"
                        class="mt-3 text-xs text-red-600 dark:text-red-400"
                    >
                        Invalid hex color format
                    </div>
                </div>
            </Float>
        </Transition>
    </div>
</template>
