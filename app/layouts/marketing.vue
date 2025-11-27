<script setup lang="ts"></script>

<template>
    <div class="pb-10 px-2 min-h-screen">
        <NavigationHeader />
        <div class="flex flex-col gap-y-20 flex-1 pt-40">
            <slot></slot>
        </div>
        <Footer />
    </div>
    <!-- <div
        class="pb-10 px-2 min-h-screen bg-stone-50 bg-[repeating-linear-gradient(135deg,theme(colors.stone.100)_0px,theme(colors.stone.100)_1px,transparent_1px,transparent_20px)] dark:bg-dark-950 dark:bg-[repeating-linear-gradient(135deg,#202020_0px,#202020_1px,transparent_1px,transparent_20px)]"
    >
        <NavigationHeader />
        <div class="flex flex-col gap-y-20 flex-1 pt-40">
            <slot></slot>
        </div>
        <Footer />
    </div> -->
</template>
