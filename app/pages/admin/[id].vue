<script setup lang="ts">
definePageMeta({ layout: "admin" });
</script>

<template>
    <NuxtLayout>
        <template #leftPane>
            <AdminNavigation />
        </template>

        <div class="h-full">
            <NuxtPage />
        </div>
    </NuxtLayout>
</template>
