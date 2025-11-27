<script setup lang="ts">
import {
    UserCircleIcon,
    LockClosedIcon,
    BellIcon,
    TrashIcon,
} from "@heroicons/vue/24/outline";

const navigationItems = [
    {
        href: "/admin/account",
        label: "Profile",
        icon: UserCircleIcon,
    },
    {
        href: "/admin/account/password",
        label: "Password",
        icon: LockClosedIcon,
    },
    {
        href: "/admin/account/delete",
        label: "Delete account",
        icon: TrashIcon,
    },
];
</script>

<template>
    <Aside label="Account settings" :items="navigationItems"> </Aside>
</template>
