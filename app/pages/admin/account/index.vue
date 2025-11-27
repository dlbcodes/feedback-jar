<script setup lang="ts">
import { z } from "zod";
import { useDebounceFn } from "@vueuse/core";

const profileStore = useProfileStore();
const { update: updateEmail } = useAuth();

// Reactive form state
const form = ref({ email: "", name: "" });
const originalData = ref({ email: "", name: "" });

// Validation schema
const validationSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).optional(),
    name: z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(50, { message: "Username must not exceed 50 characters" })
        .optional(),
});

// Validation hooks
const { errors, validate, resetErrors } = useValidation(validationSchema);

// Initialize on client only
onMounted(() => {
    form.value.email = profileStore.user?.email || "";
    form.value.name = profileStore.profile?.name || "";
    originalData.value.email = form.value.email;
    originalData.value.name = form.value.name;
});

// Computed property to check if there are changes
const isSaveDisabled = computed(() => {
    return (
        form.value.email === originalData.value.email &&
        form.value.name === originalData.value.name
    );
});

// Loading state
const isLoading = ref(false);

// Optimized save function with error handling
const handleSubmit = useDebounceFn(async () => {
    resetErrors();
    const isValid = validate(form.value);

    if (!isValid) return;

    isLoading.value = true;

    const updates = [];

    if (form.value.email !== originalData.value.email) {
        updates.push(
            updateEmail({ email: form.value.email }).catch((error) => {
                console.error("Email update failed:", error);
                errors.value.email = "Failed to update email.";
            })
        );
    }

    if (form.value.name !== originalData.value.name) {
        updates.push(
            profileStore
                .updateProfile({ name: form.value.name })
                .catch((error: any) => {
                    console.error("Name update failed:", error);
                    errors.value.name = "Failed to update name.";
                })
        );
    }

    await Promise.all(updates);

    if (updates.length > 0 && !errors.value.email && !errors.value.name) {
        originalData.value.email = form.value.email;
        originalData.value.name = form.value.name;
    }

    isLoading.value = false;
}, 300);
</script>

<template>
    <ClientOnly>
        <div class="flex flex-col gap-y-6 max-w-2xl pl-20 pt-20">
            <Header
                title="Personal details"
                subtitle="Update your username and manage your account"
            />

            <AvatarUpload
                :currentAvatar="profileStore.profile?.avatar"
                :name="profileStore.profile?.name"
                :userId="profileStore.profile?.id"
            />

            <div class="flex flex-col gap-y-4">
                <!-- Name -->
                <Field
                    id="name"
                    class="flex-1"
                    label="Name"
                    placeholder="Name"
                    :error="errors?.name"
                >
                    <Input type="text" v-model="form.name" />
                </Field>

                <!-- Email -->
                <Field
                    id="email"
                    class="flex-1"
                    label="Email"
                    placeholder="Email"
                    :error="errors?.email"
                >
                    <Input type="text" v-model="form.email" />
                </Field>

                <Button
                    :loading="isLoading"
                    :disabled="isSaveDisabled"
                    @click="handleSubmit"
                    class="w-fit place-self-end"
                >
                    Save changes
                </Button>
            </div>
        </div>
    </ClientOnly>
</template>
