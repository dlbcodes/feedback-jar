<script setup lang="ts">
const props = defineProps<{
    className?: string;
}>();

const slots = useSlots();
const isExpanded = ref(false);

const toggle = () => {
    isExpanded.value = !isExpanded.value;
};

const colspan = computed(() => 999);
</script>

<template>
    <tr
        @click="toggle"
        :class="
            cn(
                'hover:bg-stone-200/50 data-[state=selected]:bg-muted border-b border-stone-200 transition-colors',
                className
            )
        "
    >
        <slot />
    </tr>
    <tr
        v-if="slots.expanded && isExpanded"
        class="bg-stone-50 border-b-6 border-stone-200"
    >
        <td :colspan="colspan" class="p-4">
            <transition name="fade">
                <div v-show="isExpanded">
                    <slot name="expanded" />
                </div>
            </transition>
        </td>
    </tr>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
