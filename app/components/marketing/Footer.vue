<script setup lang="ts">
import { siteConfig } from "~/config/marketing";
</script>

<template>
    <footer class="w-full flex flex-col max-w-6xl mx-auto pt-20">
        <Panel>
            <div
                class="flex flex-col gap-y-4 md:flex-row justify-between gap-x-32 w-full rounded-2xl py-16 px-10"
            >
                <div class="flex flex-col gap-y-8">
                    <!-- Logo -->
                    <div class="flex flex-col gap-y-4">
                        <Logo />
                        <p class="text-sm text-stone-500 dark:text-dark-400">
                            Lightweight feedback capture for fast-moving teams.
                            One script tag. Zero friction. All the context you
                            need.
                        </p>
                    </div>
                    <!-- End Logo -->
                    <!-- Theme Selector -->
                    <ThemeSwitcher />
                    <!-- End Theme Selector -->
                </div>

                <div
                    class="flex flex-col gap-y-8 md:flex-row md:gap-x-24 md:min-w-lg"
                >
                    <!-- Product -->
                    <div class="flex flex-col flex-1 gap-y-2">
                        <h3
                            class="flex items-center gap-x-1 text-base font-medium text-stone-950 dark:text-dark-100"
                        >
                            Product
                        </h3>
                        <ul class="flex flex-col gap-y-2">
                            <li
                                class="text-sm text-stone-500 cursor-pointer ease-in-out duration-100 hover:text-stone-700 dark:text-dark-400 dark:hover:text-dark-300"
                            >
                                <NuxtLink :to="{ name: 'marketing-pricing' }">
                                    Pricing
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                    <!-- End Product -->

                    <!-- Company -->
                    <div class="flex flex-col flex-1 gap-y-2">
                        <h3
                            class="flex items-center gap-x-1 text-base font-medium text-stone-950 dark:text-dark-100"
                        >
                            Company
                            <Badge size="xs" variant="secondary">Soon</Badge>
                        </h3>
                        <ul class="flex flex-col gap-y-2">
                            <li
                                class="text-sm text-stone-500 cursor-pointer ease-in-out duration-100 hover:text-stone-700 dark:text-dark-400 dark:hover:text-dark-300"
                            >
                                About
                            </li>
                            <li
                                class="text-sm text-stone-500 cursor-pointer ease-in-out duration-100 hover:text-stone-700 dark:text-dark-400 dark:hover:text-dark-300"
                            >
                                Blog
                            </li>
                            <li
                                class="text-sm text-stone-500 cursor-pointer ease-in-out duration-100 hover:text-stone-700 dark:text-dark-400 dark:hover:text-dark-300"
                            >
                                Careers
                            </li>
                            <li
                                class="text-sm text-stone-500 cursor-pointer ease-in-out duration-100 hover:text-stone-700 dark:text-dark-400 dark:hover:text-dark-300"
                            >
                                Changelog
                            </li>
                        </ul>
                    </div>
                    <!-- End Company -->

                    <!-- Social -->
                    <div class="flex flex-col flex-1 gap-y-2">
                        <h3
                            class="flex items-center gap-x-1 text-base font-medium text-stone-950 dark:text-dark-100"
                        >
                            Social
                        </h3>
                        <ul class="flex flex-col gap-y-2">
                            <li
                                v-for="(url, name) in siteConfig.links"
                                :key="name"
                            >
                                <NuxtLink
                                    :to="url"
                                    target="_blank"
                                    class="capitalize text-sm text-stone-500 cursor-pointer ease-in-out duration-100 hover:text-stone-700 dark:text-dark-400 dark:hover:text-dark-300"
                                >
                                    {{ name }}
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                    <!-- End Social -->
                </div>
            </div>
            <template #footer>
                <div
                    class="flex flex-col items-center gap-y-2 md:flex-row justify-between px-6 py-2"
                >
                    <div class="flex gap-x-6">
                        <NuxtLink
                            :to="{ name: 'legal-terms' }"
                            class="font-mono text-xs text-stone-800 cursor-pointer ease-in-out duration-200 hover:text-stone-950 dark:text-dark-400 dark:hover:text-dark-300"
                        >
                            Privacy Policy
                        </NuxtLink>
                        <NuxtLink
                            :to="{ name: 'legal-privacy' }"
                            class="font-mono text-xs text-stone-800 cursor-pointer ease-in-out duration-200 hover:text-stone-950 dark:text-dark-400 dark:hover:text-dark-300"
                        >
                            Terms and Conditions
                        </NuxtLink>
                    </div>
                    <div
                        class="font-mono text-xs text-stone-800 dark:text-dark-400"
                    >
                        © {{ new Date().getFullYear() }} {{ siteConfig.name }}.
                        All Rights Reserved.
                    </div>
                </div>
            </template>
        </Panel>
    </footer>
</template>
