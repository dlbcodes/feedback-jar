<script setup lang="ts">
import { ref } from "vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { Float } from "@headlessui-float/vue";
import { useRouter } from "vue-router";
import { navigationVariants } from "~/variants/NavigationVariants";
import { popoverVariants } from "~/variants/PopoverVariants";
import { emailApiService } from "~/services/EmailApiService";
// import { dropdownVariants } from "~/variants/DropdownVariant";

// Import any icons you need
import {
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    ChatBubbleBottomCenterTextIcon,
    ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/outline";

const { signOut, error, loading } = useAuth();
// Access profileStore instead of userStore
const profileStore = useProfileStore();
const { profile, user, isAuthenticated } = storeToRefs(profileStore);

const showFeedbackModal = ref(false);

// Initialize router for navigation
const router = useRouter();

// Define action functions for each option
const goToSettings = () => {
    router.push("/admin/account");
};

const openSendFeedbackModal = () => {
    // Replace with your modal-opening logic
    console.log("Open Send Feedback modal");
    showFeedbackModal.value = !showFeedbackModal.value;
};

const handleFeedbackSubmitted = async (data: any) => {
    console.log("submitted", data);
};

// Define the options array with labels, actions, and icons
const options = [
    {
        label: "Dashboard",
        action: () => {
            router.push("/admin");
        },
        icon: ChatBubbleBottomCenterTextIcon,
    },
    { label: "Account Settings", action: goToSettings, icon: Cog6ToothIcon },
    {
        label: "Send feedback",
        action: openSendFeedbackModal,
        icon: ChatBubbleBottomCenterTextIcon,
    },
    { label: "Sign out", action: signOut, icon: ArrowRightOnRectangleIcon },
];
</script>

<template>
    <div class="relative inline-block text-left">
        <Menu as="div">
            <Float
                placement="bottom-end"
                :offset="8"
                flip
                shift
                :z-index="99999"
                portal
            >
                <!-- Dropdown Button: Avatar -->
                <MenuButton
                    class="flex items-center gap-x-2 focus:outline-none"
                >
                    <Avatar
                        size="sm"
                        :src="profile?.avatar"
                        :name="profile?.name"
                        :id="profile?.id"
                    />
                </MenuButton>

                <!-- Dropdown Menu with Transition -->
                <Transition
                    enter="transition ease-out duration-200"
                    enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95"
                >
                    <MenuItems
                        :class="
                            cn(
                                popoverVariants({
                                    variant: 'contrast',
                                    size: 'xs',
                                })
                            )
                        "
                    >
                        <!-- Header section with user info -->
                        <div class="flex gap-x-2 pt-4 pb-2 px-3">
                            <Avatar
                                size="sm"
                                :src="profile?.avatar"
                                :name="profile?.name"
                                :id="profile?.id"
                            />
                            <div class="flex-1">
                                <p class="text-sm font-medium text-stone-950">
                                    {{ profile?.name }}
                                </p>
                                <p
                                    class="font-mono text-xs font-medium text-stone-500"
                                >
                                    {{ user?.email }}
                                </p>
                            </div>
                        </div>
                        <!-- Options -->
                        <div class="flex flex-col gap-y-1 py-1">
                            <MenuItem
                                v-for="(option, index) in options"
                                :key="index"
                                class="flex items-center w-full"
                                v-slot="{ active, close }"
                            >
                                <button
                                    @click.prevent="
                                        option.action();
                                        close();
                                    "
                                    :class="
                                        cn(
                                            navigationVariants({
                                                variant: 'contrast',
                                            })
                                        )
                                    "
                                >
                                    <div
                                        class="flex items-center gap-x-2 min-w-0"
                                    >
                                        <!-- If an icon is provided, render it -->
                                        <component
                                            v-if="option.icon"
                                            :is="option.icon"
                                            class="size-5 shrink-0"
                                        />
                                        {{ option.label }}
                                    </div>
                                </button>
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Transition>
            </Float>
        </Menu>
    </div>

    <ClientOnly>
        <FeedbackModal
            v-model="showFeedbackModal"
            @submitted="handleFeedbackSubmitted"
        />
    </ClientOnly>
</template>
