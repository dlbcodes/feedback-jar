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

const message = ref("");
const isLoading = ref(false);

watch(
    () => props.modelValue,
    (isOpen) => {
        if (!isOpen) {
            message.value = "";
        }
    }
);

const submit = async () => {
    isLoading.value = true;

    try {
        const result = await emailApiService.sendHtml(
            "daniellobosilva@gmail.com",
            "[FEEDBACK] New message",
            "feedback",
            { message: message.value }
        );

        addToast("Feedback sent successfully!", { type: "success" });
        emit("submitted", result);
        emit("update:modelValue", false);
    } catch (error) {
        addToast("Failed to send feedback. Please try again.", {
            type: "error",
        });
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <Modal
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        :closeOnBackdrop="false"
    >
        <div class="flex flex-col gap-y-6 pt-4">
            <div
                class="flex flex-col justify-center items-center gap-y-2 overflow-hidden text-center"
            >
                <Logo />
                <h3
                    class="w-full overflow-hidden whitespace-nowrap truncate text-2xl tracking-tight text-balance font-semibold max-sm:px-4 sm:text-2xl lg:text-2xl xl:text-2xl text-stone-950 dark:text-dark-200"
                >
                    Got Thoughts? We’re All Ears
                </h3>
                <p class="text-sm text-stone-500">
                    Tell us what you love, hate, or wish existed — your feedback
                    shapes what comes next.
                </p>
            </div>
            <div class="space-y-4">
                <Field
                    id="message"
                    label="Message"
                    placeholder="Type your message..."
                >
                    <Textarea v-model="message" class="h-32 px-1" />
                </Field>
            </div>
        </div>

        <template #footer="{ close }">
            <Button variant="ghost" @click="close">Cancel</Button>
            <Button
                :loading="isLoading"
                :disabled="!message.trim() || isLoading"
                @click="submit"
                class="w-fit"
            >
                Send Feedback
            </Button>
        </template>
    </Modal>
</template>
