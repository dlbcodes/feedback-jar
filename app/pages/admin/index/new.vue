<script setup lang="ts">
const {
    currentStep,
    completedSteps,
    websiteId,
    handleSubmit,
    handleScriptInstalled,
    form,
    errors,
    favicon,
    timezones,
} = useProjectWizard();
</script>

<template>
    <div class="flex flex-col justify-center">
        <header class="flex justify-between px-8 py-6">
            <Logo />
            <AvatarDropdown />
        </header>

        <div class="w-full max-w-3xl mx-auto py-10">
            <WizardSteps
                :completed-steps="completedSteps"
                :current-step="currentStep"
            />

            <AddSite
                v-if="currentStep === 1"
                :form="form"
                :errors="errors"
                :favicon="favicon"
                :timezones="timezones"
                @submit="handleSubmit"
            />

            <InstallScript
                v-else-if="currentStep === 2"
                :website-id="websiteId"
                @done="handleScriptInstalled"
            />

            <WaitingEvent
                :website-id="websiteId"
                v-else-if="currentStep === 3"
            />
        </div>
    </div>
</template>
