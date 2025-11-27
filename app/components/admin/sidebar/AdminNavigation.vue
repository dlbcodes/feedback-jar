<script setup lang="ts">
// Route
const route = useRoute();
const projectId = computed(() => route.params.id as string);

// Local state
const showHelpModal = ref(false);
const showShortcutsModal = ref(false);

const handleHelpSubmitted = (data: any) => {
    console.log("Help submitted:", data);
};
</script>

<template>
    <Aside>
        <template #top>
            <ProjectSwitcher />
        </template>

        <MainNavigation />

        <template #bottom>
            <FooterControls
                @openHelp="showHelpModal = true"
                @openShortcuts="showShortcutsModal = true"
            />
        </template>
    </Aside>

    <HelpModal v-model="showHelpModal" @submitted="handleHelpSubmitted" />
    <ShortcutsModal v-model="showShortcutsModal" />
</template>
