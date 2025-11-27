<script setup lang="ts">
import { registerSchema, type registerSchemaType } from "~/types/auth";
import { buttonVariants } from "~/variants/ButtonVariants";
import { siteConfig } from "~/config/marketing";

usePageMeta({
    title: "Sign Up",
    description:
        "Create your free Graphio account and start building beautiful charts in minutes.",
});

definePageMeta({
    layout: "auth",
    middleware: "guest",
});

const { register, error, loading } = useAuth();
const { errors, validate, resetErrors } = useValidation(registerSchema);
const form = reactive<registerSchemaType>({
    name: "",
    email: "",
    password: "",
});

const handleRegister = async () => {
    console.log("handleRegister");
    resetErrors();

    const isValid = validate(form);
    if (!isValid) return;

    const success = await register(form);
    if (success) navigateTo("/confirmation");
};
</script>

<template>
    <NuxtLayout>
        <div class="flex flex-col gap-y-12">
            <AuthHeader
                tagline="Sign up for free!"
                :title="`Join ${siteConfig.name}`"
                message="Already have an account?"
                to="login"
                label="Login"
            />

            <!-- Register Error -->
            <AuthError :error="error" />
            <!-- End Register Error -->

            <form
                @submit.prevent="handleRegister"
                class="flex flex-col gap-y-4 w-full"
            >
                <!-- Name -->
                <Field
                    id="name"
                    class="flex-1"
                    label="Name"
                    placeholder="Name"
                    :error="errors?.name"
                >
                    <Input type="text" v-model="form.name"> </Input>
                </Field>
                <!-- End Name -->

                <!-- Email -->
                <Field
                    id="email"
                    class="flex-1"
                    label="Email"
                    placeholder="Email"
                    :error="errors?.email"
                >
                    <Input type="text" v-model="form.email"> </Input>
                </Field>
                <!-- End email -->

                <!-- Password -->
                <Field
                    id="password"
                    class="flex-1"
                    label="Password"
                    placeholder="Password"
                    type="password"
                    :error="errors?.password"
                >
                    <Input v-model="form.password"> </Input>
                </Field>
                <!-- End Password -->

                <!-- Button Sign up -->
                <Button
                    @click="handleRegister"
                    variant="primary"
                    :loading="loading"
                >
                    Sign up
                    <AnimatedArrow />
                </Button>
                <!-- End Button Sign up -->
                <!-- Terms and condtions -->
                <div
                    class="text-sm/6 text-gray-600 dark:text-gray-400 mt-4 text-center"
                >
                    <p>
                        By creating an account you agree with our
                        <NuxtLink
                            to="terms"
                            :class="
                                cn(
                                    buttonVariants({
                                        variant: 'link',
                                        size: 'none',
                                    })
                                )
                            "
                            >Terms of service</NuxtLink
                        >,
                        <NuxtLink
                            to="privacy"
                            :class="
                                cn(
                                    buttonVariants({
                                        variant: 'link',
                                        size: 'none',
                                    })
                                )
                            "
                            >Privacy Policy</NuxtLink
                        >
                    </p>
                </div>
                <!-- End Terms and condtions -->
            </form>
        </div>
    </NuxtLayout>
</template>
