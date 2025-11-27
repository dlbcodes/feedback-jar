<script setup lang="ts">
import { waitlistSchema, type waitlistSchemaType } from "~/types/auth";
import { buttonVariants } from "~/variants/ButtonVariants";

useHead({
    title: "Join the Waitlist | Graphio",
    meta: [
        {
            name: "description",
            content:
                "Be the first to try new features. Join the Graphio waitlist and get early access.",
        },
        { property: "og:title", content: "Join the Waitlist | Graphio" },
        {
            property: "og:description",
            content:
                "Be the first to try new features. Join the Graphio waitlist and get early access.",
        },
        { property: "og:url", content: "https://yourdomain.com/waitlist" },
        { property: "og:type", content: "website" },
    ],
});

definePageMeta({
    layout: "auth",
    middleware: "guest",
});

const { errors, validate, resetErrors } = useValidation(waitlistSchema);
const success = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const form = reactive<waitlistSchemaType>({
    name: "",
    email: "",
});

const handleWaitlist = async () => {
    resetErrors();
    error.value = null;

    const isValid = validate(form);
    if (!isValid) return;

    loading.value = true;

    try {
        const response = await $fetch("/api/v1/waitlist", {
            method: "POST",
            body: {
                name: form.name,
                email: form.email,
            },
        });

        if (response.success) {
            success.value = true;
        }
    } catch (err: any) {
        console.error("Waitlist error:", err);

        if (err.statusCode === 409) {
            error.value = "This email is already on the waitlist.";
        } else if (err.data) {
            // Handle validation errors from server
            Object.assign(errors, err.data);
        } else {
            error.value =
                err.statusMessage || "Something went wrong. Please try again.";
        }
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <NuxtLayout>
        <div v-if="!success" class="flex flex-col gap-y-12">
            <AuthHeader
                tagline="You're almost there"
                title="Join the waitlist"
                message="We'll notify you when it's ready."
            />

            <!-- Login Error -->
            <AuthError :error="error" />
            <!-- End Login Error -->

            <!-- form -->
            <form
                @submit.prevent="handleWaitlist"
                class="flex flex-col gap-y-4 w-full"
            >
                <!-- Name -->
                <Field
                    id="name"
                    class="flex-1"
                    label="Name"
                    placeholder="Name"
                    type="text"
                    :error="errors?.name"
                >
                    <Input v-model="form.name" />
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
                    <Input type="text" v-model="form.email" />
                </Field>
                <!-- End Email -->

                <!-- Button Sign up -->
                <Button variant="primary" :loading="loading" type="submit">
                    Join waitlist
                    <AnimatedArrow />
                </Button>
                <!-- End Button Sign up -->

                <!-- Forgot password -->
                <div
                    class="text-sm/6 text-gray-600 dark:text-gray-400 mt-4 text-center"
                >
                    <p>
                        <NuxtLink
                            to="/"
                            :class="
                                cn(
                                    buttonVariants({
                                        variant: 'link',
                                        size: 'null',
                                    })
                                )
                            "
                        >
                            Go back to homepage.
                        </NuxtLink>
                    </p>
                </div>
                <!-- End Forgot password -->
            </form>
            <!-- End form -->
        </div>
        <!-- Sucess -->
        <div v-else class="text-center space-y-4">
            <AuthHeader
                title="🎉 You're on the list!"
                message="We'll reach out when everything is ready. Thanks for
                    joining!"
                to="/"
                label="Go back to homepage."
            />
        </div>
        <!-- End Sucess -->
    </NuxtLayout>
</template>
