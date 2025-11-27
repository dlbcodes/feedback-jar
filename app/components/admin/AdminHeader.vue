<script setup lang="ts">
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

interface Props {
    title: string;
    subtitle?: string;
    loading?: boolean;
    showRefresh?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    showRefresh: true,
});

const emit = defineEmits<{
    refresh: [];
}>();
</script>

<template>
    <div class="flex items-center gap-x-5 pt-10 pb-2">
        <h1 class="text-2xl font-semibold">{{ title }}</h1>
        <div v-if="subtitle || showRefresh" class="flex items-center gap-x-4">
            <Button
                v-if="showRefresh"
                variant="icon"
                size="icon"
                @click="emit('refresh')"
                :disabled="loading"
                title="Refresh"
            >
                <ArrowPathIcon
                    class="size-4"
                    :class="{ 'animate-spin': loading }"
                />
            </Button>
            <span v-if="subtitle && !loading" class="text-xs text-stone-600">
                {{ subtitle }}
            </span>
            <span v-else class="text-xs text-stone-600">Loading...</span>
        </div>
    </div>
</template>
