<script setup lang="ts">
import { recoverSchema, type recoverSchemaType } from "~/types/auth";
import { buttonVariants } from "~/variants/ButtonVariants";

usePageMeta({
    title: "Reset Password",
    description:
        "Choose a new password to securely access your Graphio account.",
});

definePageMeta({
    layout: "auth",
    middleware: "guest",
});

const form = reactive<recoverSchemaType>({
    password: "",
});

const { error, loading, update } = useAuth();
const { errors, validate, resetErrors } = useValidation(recoverSchema);
const { addToast } = useToast();

const handleRecover = async () => {
    resetErrors();
    const isValid = validate(form);
    if (!isValid) return;
    const success = await update(form);
    addToast("Your password has been updated successfully!", {
        type: "success",
    });
    if (success) navigateTo("/admin");
};
</script>

<template>
    <NuxtLayout>
        <div class="flex flex-col gap-y-12">
            <AuthHeader
                tagline="Reset your password"
                title="Choose a new password"
                message="Choose a new password to get back into your account."
            />

            <!-- Recover Error -->
            <AuthError :error="error" />
            <!-- End Recover Error -->

            <form
                @submit.prevent="handleRecover"
                class="flex flex-col gap-y-4 w-full"
            >
                <!-- Password -->
                <Field
                    id="password"
                    class="flex-1"
                    label="New Password"
                    placeholder="New Password"
                    type="password"
                    :error="errors?.password"
                >
                    <Input v-model="form.password" />
                </Field>
                <!-- End Password -->

                <!-- Button Sign up -->
                <Button
                    variant="primary"
                    :loading="loading"
                    @click="handleRecover"
                >
                    Recover password
                    <AnimatedArrow />
                </Button>
                <!-- End Button Sign up -->
            </form>
        </div>
    </NuxtLayout>
</template>
