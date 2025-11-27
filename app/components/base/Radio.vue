<script setup lang="ts">
import {
    RadioGroup,
    RadioGroupLabel,
    RadioGroupDescription,
    RadioGroupOption,
} from "@headlessui/vue";
import {
    selectorGroupVariants,
    selectorVariants,
    type SelectorGroupVariantsProps,
} from "~/variants/ButtonGroupVariants";

interface Option {
    label: string;
    value: string;
}

const props = withDefaults(
    defineProps<{
        orientation?: SelectorGroupVariantsProps["orientation"];
        options: Option[];
        queryKey?: string;
        defaultValue?: string;
    }>(),
    {
        orientation: "horizontal",
    }
);

const queryKey = props.queryKey || "period";
const route = useRoute();
const router = useRouter();

// Get initial value from URL or fallback
const selected = ref(
    route.query[queryKey]?.toString() ||
        props.defaultValue ||
        props.options[0].value
);

// Watch selected and update URL
watch(selected, (val) => {
    router.replace({ query: { ...route.query, [queryKey]: val } });
});
</script>

<template>
    <RadioGroup
        v-model="selected"
        :class="cn(selectorGroupVariants({ orientation: 'horizontal' }))"
    >
        <RadioGroupOption
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            v-slot="{ checked }"
            as="template"
        >
            <button :class="cn(selectorVariants({ selected: checked }))">
                {{ option.label }}
            </button>
        </RadioGroupOption>
    </RadioGroup>
</template>

<style scoped>
/* Optional: smooth hover transition */
.RadioGroupOption:hover {
    background-color: rgba(59, 130, 246, 0.1);
}
</style>
