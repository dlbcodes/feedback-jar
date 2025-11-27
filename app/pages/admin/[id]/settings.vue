<script setup lang="ts">
const feedbackStore = useFeedbackStore();
const route = useRoute();

const projectId = computed(() => route.params.id as string);

// State for new type form
const showAddTypeModal = ref(false);
const newTypeName = ref("");
const newTypeLabel = ref("");
const newTypeEmoji = ref("");
const isSubmitting = ref(false);

// Load types on mount
onMounted(async () => {
    if (projectId.value) {
        await feedbackStore.fetchTypes(projectId.value);
    }
});

// Add new type
const addType = async () => {
    if (!newTypeName.value.trim() || !newTypeLabel.value.trim()) {
        return;
    }

    isSubmitting.value = true;

    try {
        const success = await feedbackStore.createType(projectId.value, {
            name: newTypeName.value.trim().toLowerCase().replace(/\s+/g, "-"),
            label: newTypeLabel.value.trim(),
            emoji: newTypeEmoji.value.trim() || undefined,
        });

        if (success) {
            // Reset form
            newTypeName.value = "";
            newTypeLabel.value = "";
            newTypeEmoji.value = "";
            showAddTypeModal.value = false;
        }
    } catch (error) {
        console.error("Failed to create type:", error);
    } finally {
        isSubmitting.value = false;
    }
};

// Generate name from label
const autoGenerateName = () => {
    if (newTypeLabel.value && !newTypeName.value) {
        newTypeName.value = newTypeLabel.value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }
};

const defaultTypes = computed(() =>
    feedbackStore.types.filter((t) => t.isDefault)
);
const customTypes = computed(() =>
    feedbackStore.types.filter((t) => !t.isDefault)
);
</script>

<template>
    <div class="space-y-6">
        {{ projectId }}
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-semibold">Widget Settings</h2>
                <p class="text-sm text-muted-foreground mt-1">
                    Configure feedback types and widget behavior
                </p>
            </div>
            <Button @click="showAddTypeModal = true">
                <Plus class="w-4 h-4 mr-2" />
                Add Custom Type
            </Button>
        </div>

        <!-- Loading State -->
        <div v-if="feedbackStore.isLoading" class="flex justify-center py-12">
            <Loader2 class="w-8 h-8 animate-spin text-muted-foreground" />
        </div>

        <!-- Content -->
        <div v-else class="space-y-6">
            <!-- Default Types -->
            <Card>
                <CardHeader>
                    <CardTitle>Default Feedback Types</CardTitle>
                    <CardDescription>
                        Built-in types available to all users
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="grid gap-3">
                        <div
                            v-for="type in defaultTypes"
                            :key="type.id"
                            class="flex items-center gap-3 p-3 border rounded-lg"
                        >
                            <div class="text-2xl">{{ type.emoji || "📝" }}</div>
                            <div class="flex-1">
                                <div class="font-medium">{{ type.label }}</div>
                                <div class="text-sm text-muted-foreground">
                                    {{ type.name }}
                                </div>
                            </div>
                            <Badge variant="secondary">Default</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Custom Types -->
            <Card>
                <CardHeader>
                    <CardTitle>Custom Feedback Types</CardTitle>
                    <CardDescription>
                        Create types specific to your project needs
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        v-if="customTypes.length === 0"
                        class="text-center py-8"
                    >
                        <div class="text-muted-foreground mb-4">
                            No custom types yet
                        </div>
                        <Button
                            variant="outline"
                            @click="showAddTypeModal = true"
                        >
                            Create your first custom type
                        </Button>
                    </div>

                    <div v-else class="grid gap-3">
                        <div
                            v-for="type in customTypes"
                            :key="type.id"
                            class="flex items-center gap-3 p-3 border rounded-lg"
                        >
                            <div class="text-2xl">{{ type.emoji || "📝" }}</div>
                            <div class="flex-1">
                                <div class="font-medium">{{ type.label }}</div>
                                <div class="text-sm text-muted-foreground">
                                    {{ type.name }}
                                </div>
                            </div>
                            <Badge>Custom</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Add Type Modal -->
        <Dialog v-model:open="showAddTypeModal">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Custom Feedback Type</DialogTitle>
                    <DialogDescription>
                        Add a new feedback type for users to select from
                    </DialogDescription>
                </DialogHeader>

                <form @submit.prevent="addType" class="space-y-4">
                    <!-- Label -->
                    <div class="space-y-2">
                        <Label for="label">Display Label *</Label>
                        <Input
                            id="label"
                            v-model="newTypeLabel"
                            @blur="autoGenerateName"
                            placeholder="e.g., Feature Request"
                            required
                        />
                        <p class="text-xs text-muted-foreground">
                            The label users will see in the widget
                        </p>
                    </div>

                    <!-- Name -->
                    <div class="space-y-2">
                        <Label for="name">Type Name *</Label>
                        <Input
                            id="name"
                            v-model="newTypeName"
                            placeholder="e.g., feature-request"
                            required
                        />
                        <p class="text-xs text-muted-foreground">
                            Internal identifier (lowercase, no spaces)
                        </p>
                    </div>

                    <!-- Emoji -->
                    <div class="space-y-2">
                        <Label for="emoji">Emoji (optional)</Label>
                        <Input
                            id="emoji"
                            v-model="newTypeEmoji"
                            placeholder="e.g., 💡"
                            maxlength="2"
                        />
                        <p class="text-xs text-muted-foreground">
                            Choose an emoji to represent this type
                        </p>
                    </div>

                    <!-- Preview -->
                    <div
                        v-if="newTypeLabel"
                        class="p-3 border rounded-lg bg-muted/50"
                    >
                        <p class="text-sm font-medium mb-2">Preview:</p>
                        <div
                            class="flex items-center gap-3 p-2 border rounded bg-background"
                        >
                            <div class="text-2xl">
                                {{ newTypeEmoji || "📝" }}
                            </div>
                            <div class="flex-1">
                                <div class="font-medium">
                                    {{ newTypeLabel }}
                                </div>
                                <div class="text-sm text-muted-foreground">
                                    {{ newTypeName || "type-name" }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            @click="showAddTypeModal = false"
                            :disabled="isSubmitting"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" :disabled="isSubmitting">
                            <Loader2
                                v-if="isSubmitting"
                                class="w-4 h-4 mr-2 animate-spin"
                            />
                            Create Type
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>
