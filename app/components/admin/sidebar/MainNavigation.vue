<script setup lang="ts">
import {
    BinocularsIcon,
    AstronautIcon,
    CogIcon,
    MessageIcon,
} from "~/assets/images/icons";

const route = useRoute();
const projectId = computed(() => route.params.id as string);

const navigationItems = computed(() => [
    {
        href: `/admin/${projectId.value}`,
        label: "Discover",
        icon: BinocularsIcon,
    },
    {
        href: `/admin/${projectId.value}/messages`,
        label: "Messages",
        icon: MessageIcon,
    },
    {
        href: `/admin/${projectId.value}/users`,
        label: "Users",
        icon: AstronautIcon,
    },
    {
        href: `/admin/${projectId.value}/settings`,
        label: "Settings",
        icon: CogIcon,
    },
]);
</script>

<template>
    <Navigation label="Navigation" :items="navigationItems" />
</template>
