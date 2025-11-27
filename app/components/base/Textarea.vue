<script setup lang="ts">
import { inputVariants, type InputProps } from "~/variants/InputVariants";

const props = withDefaults(
    defineProps<{
        variant?: InputProps["variant"];
        size?: InputProps["size"];
        id?: string;
        modelValue: string | number;
        placeholder?: string;
        required?: boolean;
        invalid?: boolean;
        class?: string;
    }>(),
    {
        variant: "primary",
        size: "base",
        loading: false,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string | null): void;
}>();

const field = inject("field", props);
</script>

<template>
    <div
        :class="[
            cn(
                inputVariants({ variant, size }),
                field.invalid
                    ? 'bg-red-100 border hover:border-red-600 focus-within:border-red-600 hover:bg-red-200  focus-within:bg-white focus-within:hover:bg-white'
                    : 'hover:shadow-input-hover focus-within:border-black dark:focus-within:border-dark-400',
                props.class
            ),
        ]"
    >
        <span class="text-[#7f7f7f]">
            <slot></slot>
        </span>
        <textarea
            :id="field.id"
            rows="10"
            :value="modelValue"
            :required="field.required"
            :placeholder="field.placeholder"
            class="resize-none w-full h-full bg-transparent outline-none py-2 text-black/70 group-hover:text-black focus:text-black dark:text-stone-400 dark:group-hover:text-dark-300 dark:focus:text-dark-100"
            @input="
                emit(
                    'update:modelValue',
                    ($event.target as HTMLInputElement).value
                )
            "
        ></textarea>
    </div>
</template>
