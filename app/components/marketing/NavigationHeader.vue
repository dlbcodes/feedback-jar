<script setup lang="ts">
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { buttonVariants, type ButtonProps } from "~/variants/ButtonVariants";

const showMobileMenu = ref(false);

const profileStore = useProfileStore(); // Use the new profile store

const toggleMobile = () => (showMobileMenu.value = !showMobileMenu.value);
</script>

<template>
    <header
        class="fixed left-0 right-0 flex items-center backdrop-blur-xs pt-4 w-full z-40 mx-auto max-w-4xl"
    >
        <Panel class="overflow-visible">
            <template #header>
                <!-- Announcement bar  -->
                <div class="flex justify-center pb-2 pt-1 px-3">
                    <p
                        class="text-xs font-mono text-stone-950 whitespace-nowrap dark:text-dark-100"
                    >
                        👉 We’re in private beta 👀.
                        <NuxtLink
                            :to="{ name: 'auth-register' }"
                            class="font-semibold"
                        >
                            Join waitlist
                        </NuxtLink>
                    </p>
                </div>
                <!-- End Announcement bar  -->
            </template>
            <!-- Navigation -->
            <div class="flex justify-between items-center">
                <!-- Logo -->
                <div class="flex-1">
                    <Logo class="w-26" />
                </div>
                <!-- End Logo -->

                <!-- Navigation -->
                <nav
                    class="hidden md:flex flex-1 justify-center items-center gap-x-8"
                >
                    <NuxtLink
                        :to="{ name: 'marketing-pricing' }"
                        class="text-xs font-mono font-semibold cursor-pointer text-stone-950 dark:text-dark-100"
                    >
                        Pricing
                    </NuxtLink>
                </nav>
                <!-- End Navigation -->

                <!-- Buttons -->
                <div class="flex flex-1 items-center justify-end gap-x-2">
                    <Button to="/waitlist" class="w-fit"
                        >Join waitlist
                        <AnimatedArrow />
                    </Button>
                    <ClientOnly>
                        <div class="flex flex-1 hidden">
                            <div
                                v-if="!profileStore.isAuthenticated"
                                class="flex flex-1 items-center justify-end gap-x-2"
                            >
                                <Button
                                    class="w-fit hidden md:flex"
                                    variant="secondary"
                                    to="login"
                                >
                                    Log in
                                </Button>
                                <Button
                                    class="w-fit hidden md:flex"
                                    variant="primary"
                                    to="register"
                                >
                                    Sign up
                                </Button>
                            </div>
                            <div
                                class="flex flex-1 items-center justify-end gap-x-2"
                                v-else
                            >
                                <AvatarDropdown />
                            </div>
                        </div>
                    </ClientOnly>
                    <button
                        @click="toggleMobile"
                        :class="
                            cn(
                                buttonVariants({
                                    variant: 'icon',
                                    size: 'icon',
                                }),
                                'block md:hidden shrink-0 size-6'
                            )
                        "
                    >
                        <Bars3Icon
                            v-if="!showMobileMenu"
                            :stroke-width="2"
                            class="block md:hidden shrink-0 size-6"
                        />
                        <XMarkIcon
                            v-else
                            :stroke-width="2"
                            class="block md:hidden shrink-0 size-6"
                        />
                    </button>
                </div>
                <!-- <MobileNavigation :show="showMobileMenu" /> -->

                <!-- End Buttons -->
            </div>
            <!-- End Navigation -->
        </Panel>
    </header>
</template>
