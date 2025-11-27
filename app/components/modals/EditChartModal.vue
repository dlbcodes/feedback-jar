<script setup lang="ts">
import {
    BrowserIcon,
    QuestionIcon,
    VintageComputerIcon,
} from "~/assets/images/icons";
import {
    selectorGroupVariants,
    selectorVariants,
} from "~/variants/ButtonGroupVariants";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";

interface Props {
    modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    submitted: [data: any];
}>();

const tabs = [
    { key: "browsers", label: "Browser", icon: BrowserIcon },
    { key: "operatingSystems", label: "OS", icon: QuestionIcon },
    { key: "devices", label: "Device", icon: VintageComputerIcon },
] as const;
</script>

<template>
    <Modal
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        size="xl"
        :closeOnBackdrop="false"
    >
        <div>
            <TabGroup>
                <!-- Tabs -->
                <TabList
                    :class="
                        cn(selectorGroupVariants({ orientation: 'horizontal' }))
                    "
                >
                    <Tab
                        v-for="tab in tabs"
                        :key="tab.key"
                        v-slot="{ selected }"
                        as="template"
                    >
                        <button :class="cn(selectorVariants({ selected }))">
                            <img :src="tab.icon" alt="" class="size-5" />
                            {{ tab.label }}
                        </button>
                    </Tab>
                </TabList>

                <!-- Tab Panels -->
                <TabPanels>
                    <TabPanel v-for="tab in tabs" :key="tab.key">
                        {{ tab }}
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>

        <template #footer="{ close }">
            <Button variant="ghost" @click="close">Cancel</Button>
            <Button class="w-fit"> Send Feedback </Button>
        </template>
    </Modal>
</template>
