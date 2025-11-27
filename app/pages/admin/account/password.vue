<script setup lang="ts">
import { passwordSchema, type passwordSchemaType } from "~/types/auth";

const form = ref<passwordSchemaType>({ password: "" });
const { update, error, loading } = useAuth();
const { errors, validate, resetErrors } = useValidation(passwordSchema);

const handleSubmit = async () => {
    resetErrors();

    const isValid = validate(form.value);
    if (!isValid) return;

    const success = await update(form.value);

    if (success) {
        // Clear form on success
        form.value.password = "";

        // Optional: You could add a success toast here
        const { addToast } = useToast();
        addToast("Password updated successfully", { type: "success" });
    }
    // Error handling is already done in useAuth() and displayed via error reactive
};
</script>

<template>
    <div class="flex flex-col gap-y-6 max-w-2xl pl-20 pt-20">
        <Header
            title="Manage your password"
            subtitle="Update your password for enhanced security"
        />

        <!-- Display auth errors if any -->
        <div v-if="error" class="mb-4">
            <AuthError :error="error" />
        </div>

        <div class="flex flex-col gap-y-4">
            <Field
                id="password"
                class="flex-1"
                label="New Password"
                placeholder="Enter new password"
                type="password"
                :error="errors?.password"
            >
                <Input
                    type="password"
                    v-model="form.password"
                    :disabled="loading"
                />
            </Field>

            <Button
                :loading="loading"
                :disabled="!form.password || loading"
                @click="handleSubmit"
                class="w-fit place-self-end"
            >
                Save changes
            </Button>
        </div>
    </div>
</template>
