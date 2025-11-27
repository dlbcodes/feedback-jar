<script setup lang="ts">
import { GlobeAltIcon } from "@heroicons/vue/24/outline";
defineProps<{
    form: any;
    errors: Record<string, string> | null;
    favicon: string | null;
    timezones: string[];
}>();
defineEmits(["submit"]);
</script>

<template>
    <Panel class="p-10">
        <Header title="Add a new website" />
        <form
            @submit.prevent="$emit('submit')"
            class="flex flex-col gap-y-4 w-full"
        >
            <Field
                id="domain"
                label="Domain"
                class="flex-1"
                placeholder="yourwebsite.com"
                :error="errors?.domain"
            >
                <Input type="text" v-model="form.domain">
                    <GlobeAltIcon v-if="!favicon" class="size-5 shrink-0" />
                    <img
                        v-else
                        :src="favicon"
                        alt="Domain favicon"
                        class="size-5 shrink-0"
                    />
                    https://
                </Input>
            </Field>

            <Field id="timezone" label="Timezone" class="flex-1">
                <Listbox
                    v-model="form.timezone"
                    :options="timezones"
                    placeholder="Select timezone"
                    searchable
                />
                <Helper>This defines what "today" means in your reports</Helper>
            </Field>

            <Button variant="primary" @click="$emit('submit')">
                Add website
                <AnimatedArrow />
            </Button>
        </form>
    </Panel>
</template>
