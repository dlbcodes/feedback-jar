<script setup lang="ts">
import AuthHeader from "~/components/auth/AuthHeader.vue";
import { resetSchema, type resetSchemaType } from "~/types/auth";
import { buttonVariants } from "~/variants/ButtonVariants";

usePageMeta({
    title: "Forgot Password",
    description: "Reset your Graphio account password quickly and securely.",
});

definePageMeta({ layout: "auth", middleware: "guest" });

const { forgot, error, loading } = useAuth();
const { errors, validate, resetErrors } = useValidation(resetSchema);
const form = reactive<resetSchemaType>({ email: "" });
const sent = ref(false);

const handleForgot = async () => {
    console.log("handleForgot");
    resetErrors();

    const isValid = validate(form);
    if (!isValid) return;

    const success = await forgot(form);
    if (success) sent.value = true;
};
</script>

<template>
    <NuxtLayout>
        <div v-if="sent">
            <div class="max-w-xl p-10 lg:p-12 mx-auto flex flex-col gap-y-12">
                <p class="text-base text-stone-600 dark:text-stone-400 mt-4">
                    Include the email address associated with your account and
                    we’ll send you an email with instructions to reset your
                    password.
                </p>
            </div>
        </div>
        <div
            v-else
            class="max-w-xl p-10 lg:p-12 mx-auto flex flex-col gap-y-12"
        >
            <AuthHeader
                title="Reset your password"
                message="Include the email address associated with your account and
                    we’ll send you an email with instructions to reset your
                    password."
            />

            <!-- Forgot Error -->
            <AuthError :error="error" />
            <!-- End Forgot Error -->

            <!-- form -->
            <form
                @submit.prevent="handleForgot"
                class="flex flex-col gap-y-4 w-full"
            >
                <!-- Email -->
                <Field
                    id="email"
                    class="flex-1"
                    placeholder="Email"
                    :error="errors?.email"
                >
                    <Input type="text" v-model="form.email" />
                </Field>
                <!-- End email -->

                <!-- Button Sign up -->
                <Button
                    variant="primary"
                    :loading="loading"
                    @click="handleForgot"
                >
                    Send reset instructions
                    <AnimatedArrow />
                </Button>
                <!-- End Button Sign up -->

                <!-- Back to login -->
                <div
                    class="text-sm/6 text-stone-600 dark:text-stone-400 mt-4 text-center"
                >
                    <p>
                        <NuxtLink
                            to="login"
                            :class="
                                cn(
                                    buttonVariants({
                                        variant: 'link',
                                        size: 'none',
                                    })
                                )
                            "
                        >
                            Back to Login
                        </NuxtLink>
                    </p>
                </div>
                <!-- End Back to login -->
            </form>
            <!-- End form -->
        </div>
    </NuxtLayout>
</template>
