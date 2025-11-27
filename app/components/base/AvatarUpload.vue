<script setup lang="ts">
import { ref, computed } from "vue";
import { CameraIcon } from "@heroicons/vue/24/outline";

interface Props {
    currentAvatar?: string | null;
    name?: string;
    userId?: string;
    maxSizeMB?: number;
}

const props = withDefaults(defineProps<Props>(), {
    maxSizeMB: 5,
});

const emit = defineEmits<{
    uploaded: [url: string];
}>();

const { uploadFile, uploading, uploadProgress } = useFileUpload();
const profileStore = useProfileStore();
const fileInputRef = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

// Computed property for display
const displayAvatar = computed(() => previewUrl.value || props.currentAvatar);

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    uploadAvatar(file);
};

const uploadAvatar = async (file: File) => {
    errorMessage.value = null;

    try {
        // Create preview immediately for better UX
        previewUrl.value = URL.createObjectURL(file);

        // Upload file to S3
        const result = await uploadFile(file, "avatar", props.maxSizeMB);

        // Update profile through the store (handles toast, error, etc.)
        const success = await profileStore.updateProfile({
            avatar: result.fileName,
        });

        if (success) {
            // Emit for parent components that need to know
            emit("uploaded", result.publicUrl);
        } else {
            // Revert preview if store update failed
            previewUrl.value = null;
        }
    } catch (error) {
        // Revert preview on upload error
        previewUrl.value = null;

        const err = error as Error;
        errorMessage.value = err.message;
    }
};

const triggerFileInput = () => {
    fileInputRef.value?.click();
};

// Cleanup preview URL on unmount
onUnmounted(() => {
    if (previewUrl.value && previewUrl.value.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl.value);
    }
});
</script>

<template>
    <div class="relative inline-block">
        <!-- Avatar Display -->
        <button
            type="button"
            @click="triggerFileInput"
            :disabled="uploading || profileStore.isLoading"
            class="relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Avatar size="xl" :src="currentAvatar" :name="name" :id="userId" />

            <!-- Overlay on Hover -->
            <div
                class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity"
                :class="{ 'opacity-100': uploading }"
            >
                <CameraIcon v-if="!uploading" class="size-6 text-white" />
                <div v-else class="text-white text-sm font-medium">
                    {{ uploadProgress }}%
                </div>
            </div>
        </button>

        <!-- Hidden File Input -->
        <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            class="hidden"
            :disabled="uploading || profileStore.isLoading"
        />

        <!-- Error Message (only for upload errors, not profile update errors) -->
        <p
            v-if="errorMessage"
            class="mt-2 text-sm text-red-600 dark:text-red-400"
        >
            {{ errorMessage }}
        </p>

        <!-- Helper Text -->
        <p v-else class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Click to upload (max {{ maxSizeMB }}MB)
        </p>
    </div>
</template>
