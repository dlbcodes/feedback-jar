<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import browserIcon from "~/assets/images/icons/browser.png";
import osIcon from "~/assets/images/icons/question.png";
import deviceIcon from "~/assets/images/icons/vintage-computer.png";
import packageIcon from "~/assets/images/icons/package.png";
import scriptIcon from "~/assets/images/icons/script.png";
import {
    selectorGroupVariants,
    selectorVariants,
} from "~/variants/ButtonGroupVariants";

defineProps<{
    websiteId?: string;
}>();

defineEmits(["done"]);

const tabs = [
    { key: "npm", label: "npm", icon: packageIcon },
    { key: "script", label: "Script", icon: scriptIcon },
] as const;
</script>

<template>
    <Panel class="flex flex-col gap-y-4 p-10">
        <Header
            title="Install Datomi"
            subtitle="From zero to insights. Add Datomi and start collecting analytics instantly."
        />

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
                <TabPanel class="flex flex-col gap-y-4">
                    <!-- Npm install -->
                    <div class="">
                        <h4 class="text-sm/6 font-semibold text-stome-900">
                            Install Datomi SDK
                        </h4>
                        <p
                            class="mb-2 text-sm text-stone-600 dark:text-dark-400"
                        >
                            Add the <code>datomi</code>
                        </p>

                        <Snippet>
                            <SnippetNpm />
                        </Snippet>
                    </div>
                    <!-- End Npm install -->

                    <!-- Npm install -->
                    <div class="">
                        <h4 class="text-sm/6 font-semibold text-stome-900">
                            Install Datomi SDK
                        </h4>
                        <p
                            class="mb-2 text-sm text-stone-600 dark:text-dark-400"
                        >
                            Add the <code>datomi</code>
                        </p>

                        <Snippet>
                            <SnippetInstall
                                :website-id="websiteId"
                                api-key="secret456"
                            />
                        </Snippet>
                    </div>
                    <!-- End Npm install -->
                </TabPanel>
                <TabPanel>
                    <div class="py-4">
                        <Snippet>
                            <SnippetTag />
                        </Snippet>
                    </div>
                    <div
                        v-if="websiteId"
                        class="mt-4 text-sm text-stone-500 bg-stone-50 rounded-lg p-3"
                    >
                        <strong>Website ID:</strong> {{ websiteId }}
                    </div>
                </TabPanel>
            </TabPanels>
        </TabGroup>

        <Button @click="$emit('done')">
            Done, I've installed the script
            <AnimatedArrow />
        </Button>
    </Panel>
</template>
