<script setup lang="ts">
import { emailApiService } from "~/services/EmailApiService";

interface Props {
    modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    submitted: [data: any];
}>();

const { addToast } = useToast();
const form = ref({ question: "", message: "" });
const isLoading = ref(false);

const submit = async () => {
    isLoading.value = true;

    try {
        const result = await emailApiService.sendHtml(
            "daniellobosilva@gmail.com",
            "[HELP] New message",
            "help",
            form.value
        );

        addToast("Help request submitted successfully!", {
            type: "success",
        });
        emit("submitted", result);
        emit("update:modelValue", false);
    } catch (error) {
        addToast("Failed to submit help request. Please try again.", {
            type: "error",
        });
        console.error("Failed to send email:", error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <Modal
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <div class="flex flex-col gap-y-6 pt-4">
            <div
                class="flex flex-col justify-center items-center gap-y-2 overflow-hidden text-center"
            >
                <Logo />
                <h3
                    class="w-full overflow-hidden whitespace-nowrap truncate text-2xl tracking-tight text-balance font-semibold max-sm:px-4 sm:text-2xl lg:text-2xl xl:text-2xl text-stone-950 dark:text-dark-200"
                >
                    Need a hand?
                </h3>
                <p class="text-sm text-stone-500">
                    Ask us anything — we’ll do our best to point you in the
                    right direction.
                </p>
            </div>
            <div class="space-y-4">
                <Field
                    id="question"
                    label="Question"
                    placeholder="What’s your question?"
                >
                    <Input type="text" v-model="form.question" />
                </Field>

                <Field
                    id="message"
                    label="Message"
                    placeholder="Tell us a bit more about what you need help with..."
                >
                    <Textarea v-model="form.message" class="h-32 px-1" />
                </Field>
            </div>
        </div>

        <template #footer="{ close }">
            <Button variant="ghost" @click="close">Cancel</Button>
            <Button :loading="isLoading" @click="submit" class="w-fit">
                Ask for help
            </Button>
        </template>
    </Modal>
</template>
