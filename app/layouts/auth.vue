<script setup lang="ts"></script>

<template>
    <div
        class="h-screen bg-stone-50 bg-[repeating-linear-gradient(135deg,theme(colors.stone.100)_0px,theme(colors.stone.100)_1px,transparent_1px,transparent_20px)] dark:bg-dark-950 dark:bg-[repeating-linear-gradient(135deg,#202020_0px,#202020_1px,transparent_1px,transparent_20px)]"
    >
        <!-- <Separator /> -->
        <div>
            <div class="flex items-center justify-between py-10 px-12">
                <Logo />
                <ThemeSwitcher />
            </div>
            <div
                class="flex flex-col justify-center gap-y-12 max-w-4xl md:min-w-2xl md:max-w-2xl p-10 lg:p-12 mx-auto"
            >
                <slot></slot>
            </div>
        </div>

        <!-- <Separator /> -->
    </div>
</template>
