<script setup lang="ts">
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const { signOut } = useAuth();
const profileStore = useProfileStore();

// State
const confirmText = ref("");
const isDeleting = ref(false);

// Validation
const CONFIRM_KEYWORD = "delete";
const isConfirmValid = computed(() => {
    return confirmText.value.toLowerCase().trim() === CONFIRM_KEYWORD;
});

// Delete account through store (follows your pattern)
const deleteAccount = async () => {
    if (!isConfirmValid.value) return;

    isDeleting.value = true;

    try {
        const success = await profileStore.deleteAccount();

        if (success) {
            // Sign out and redirect
            await signOut();
            router.push("/goodbye");
        }
    } finally {
        isDeleting.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col gap-y-6 max-w-2xl pl-20 pt-20">
        <Header
            title="Delete Account"
            subtitle="Permanently remove your account and all associated data"
        />

        <Panel class="bg-red-50 shadow-none border-b border-red-200">
            <div class="flex gap-x-3">
                <ExclamationTriangleIcon
                    class="size-6 text-red-600 shrink-0 mt-0.5"
                />
                <div>
                    <h3 class="text-sm font-semibold text-red-900">
                        Warning: This action cannot be undone
                    </h3>
                    <p class="mt-1 text-sm text-red-700">
                        Once you delete your account, all your data will be
                        <strong>permanently</strong> removed from our servers.
                    </p>
                </div>
            </div>
            <template #footer>
                <div class="mb-6 p-4">
                    <h4 class="text-sm font-semibold text-stone-900 mb-3">
                        What will be deleted:
                    </h4>
                    <ul class="space-y-2 text-sm text-stone-600">
                        <li class="flex items-start gap-x-2">
                            <span class="text-red-500 mt-0.5">•</span>
                            <span>Your profile and account information</span>
                        </li>
                        <li class="flex items-start gap-x-2">
                            <span class="text-red-500 mt-0.5">•</span>
                            <span>All uploaded files and media</span>
                        </li>
                        <li class="flex items-start gap-x-2">
                            <span class="text-red-500 mt-0.5">•</span>
                            <span>Your preferences and settings</span>
                        </li>
                        <li class="flex items-start gap-x-2">
                            <span class="text-red-500 mt-0.5">•</span>
                            <span>Access to all services and features</span>
                        </li>
                    </ul>
                </div>
            </template>
        </Panel>

        <!-- Confirmation Form -->
        <div class="flex flex-col gap-y-4">
            <Field
                id="delete"
                class="flex-1"
                :label="`Type '${CONFIRM_KEYWORD}' to confirm`"
            >
                <Input
                    type="text"
                    v-model="confirmText"
                    placeholder="Type 'delete' here"
                    :disabled="isDeleting"
                />
            </Field>

            <Button
                variant="destructive"
                :loading="isDeleting"
                :disabled="!isConfirmValid || isDeleting"
                @click="deleteAccount"
                class="w-fit place-self-end"
            >
                {{
                    isDeleting
                        ? "Deleting Account..."
                        : "Delete Account Permanently"
                }}
            </Button>
        </div>
    </div>
</template>
