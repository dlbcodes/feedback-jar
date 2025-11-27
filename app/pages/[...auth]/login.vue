<script setup lang="ts">
import { loginSchema, type loginSchemaType } from "~/types/auth";
import { buttonVariants } from "~/variants/ButtonVariants";

usePageMeta({
    title: "Login",
    description:
        "Sign in to your Graphio account to create, save, and share beautiful charts.",
});

definePageMeta({
    layout: "auth",
    middleware: "guest",
});

const { login, error, loading } = useAuth();
const { errors, validate, resetErrors } = useValidation(loginSchema);
const form = reactive<loginSchemaType>({
    email: "",
    password: "",
});

const handleLogin = async () => {
    resetErrors();
    const isValid = validate(form);
    if (!isValid) return;
    const success = await login(form);
    if (success) navigateTo("/admin");
};
</script>

<template>
    <NuxtLayout>
        <div class="flex flex-col gap-y-12">
            <AuthHeader
                tagline="Log in to your account"
                title="Welcome back!"
                message="Don't have an account?"
                to="register"
                label="Sign up"
            />

            <!-- Login Error -->
            <AuthError :error="error" />
            <!-- End Login Error -->

            <!-- form -->
            <form
                @submit.prevent="handleLogin"
                class="flex flex-col gap-y-4 w-full"
            >
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
                <!-- End Email -->

                <!-- Password -->
                <Field
                    id="password"
                    class="flex-1"
                    label="Password"
                    placeholder="Password"
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
                    @click="handleLogin"
                >
                    Login
                    <AnimatedArrow />
                </Button>
                <!-- End Button Sign up -->

                <!-- Forgot password -->
                <div
                    class="text-sm/6 text-gray-600 dark:text-gray-400 mt-4 text-center"
                >
                    <p>
                        <NuxtLink
                            to="forgot"
                            :class="
                                cn(
                                    buttonVariants({
                                        variant: 'link',
                                        size: 'none',
                                    })
                                )
                            "
                        >
                            Forgot password?
                        </NuxtLink>
                    </p>
                </div>
                <!-- End Forgot password -->
            </form>
            <!-- End form -->
        </div>
    </NuxtLayout>
</template>
